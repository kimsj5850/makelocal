import type { SupabaseClient } from "@supabase/supabase-js";
import type { RequestDraft, RfqDraft } from "@/types/request";

type CreatedPrototypeRequest = {
  id: string;
  request_code: string;
};

function splitTextToList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(/[\n,·/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toAssemblyRequired(value: string | undefined) {
  if (value === "조립 필요") {
    return true;
  }

  if (value === "단품 제작") {
    return false;
  }

  return null;
}

function needsConfirmation(value: string | undefined) {
  return (
    !value ||
    value.trim() === "" ||
    value.includes("확인 필요") ||
    value.includes("미입력")
  );
}

function getMissingInformation(rfq: RfqDraft) {
  const missingItems: string[] = [];

  if (needsConfirmation(rfq.material)) {
    missingItems.push("소재");
  }

  if (needsConfirmation(rfq.quantity)) {
    missingItems.push("수량");
  }

  if (needsConfirmation(rfq.tolerance)) {
    missingItems.push("요구 공차");
  }

  if (needsConfirmation(rfq.postProcessing)) {
    missingItems.push("후처리");
  }

  return missingItems;
}

export function generateRequestCode() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `MCL-${datePart}-${randomPart}`;
}

export async function createPrototypeRequest(
  supabase: SupabaseClient,
  draft: RequestDraft,
  requestCode: string,
) {
  const { data, error } = await supabase
    .from("prototype_requests")
    .insert({
      request_code: requestCode,
      status: "submitted",
      title: draft.rfq.title ?? null,
      description: draft.rfq.partDescription ?? null,
      purpose: draft.rfq.purpose ?? null,
      contact_name: draft.contact.name ?? null,
      company_name: draft.contact.companyName ?? null,
      email: draft.contact.email ?? null,
      phone: draft.contact.phone ?? null,
      preferred_contact: draft.contact.preferredContact ?? null,
      submitted_at: new Date().toISOString(),
    })
    .select("id, request_code")
    .single<CreatedPrototypeRequest>();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Prototype request was not created.");
  }

  return data;
}

export async function createRfqDraft(
  supabase: SupabaseClient,
  requestId: string,
  rfq: RfqDraft,
) {
  const { error } = await supabase.from("rfq_drafts").insert({
    request_id: requestId,
    ai_generated: null,
    final_rfq: rfq,
    recommended_processes: splitTextToList(rfq.recommendedProcess),
    material: rfq.material ?? null,
    quantity: rfq.quantity ?? null,
    tolerance: rfq.tolerance ?? null,
    post_processing: rfq.postProcessing ?? null,
    assembly_required: toAssemblyRequired(rfq.assemblyRequired),
    estimated_cost_min: null,
    estimated_cost_max: null,
    estimated_lead_time_min_days: null,
    estimated_lead_time_max_days: null,
    cost_confidence: "low",
    missing_information: getMissingInformation(rfq),
    supplier_questions: splitTextToList(rfq.supplierQuestions),
    cost_drivers: splitTextToList(rfq.costDrivers),
  });

  if (error) {
    throw error;
  }
}

export async function createRequestStatusLog(
  supabase: SupabaseClient,
  requestId: string,
) {
  const { error } = await supabase.from("request_status_logs").insert({
    request_id: requestId,
    from_status: null,
    to_status: "submitted",
    changed_by: "system",
    memo: "사용자 제작 문의 제출",
  });

  if (error) {
    throw error;
  }
}
