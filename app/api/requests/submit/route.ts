import { NextResponse } from "next/server";
import { createRequestFiles } from "@/lib/supabase/files";
import { createSupplierRecommendation } from "@/lib/supabase/recommendations";
import {
  createPrototypeRequest,
  createRequestStatusLog,
  createRfqDraft,
  generateRequestCode,
} from "@/lib/supabase/requests";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { RequestDraft, SubmitRequestResponse } from "@/types/request";

const genericErrorMessage = "제작 문의 저장 중 문제가 발생했습니다.";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeRequestDraft(value: unknown): RequestDraft {
  const draft = isObject(value) ? value : {};
  const contact = isObject(draft.contact) ? draft.contact : {};
  const rfq = isObject(draft.rfq) ? draft.rfq : {};
  const selectedSupplier = isObject(draft.selectedSupplier)
    ? draft.selectedSupplier
    : {};

  return {
    files: Array.isArray(draft.files) ? (draft.files as RequestDraft["files"]) : [],
    rfq: rfq as RequestDraft["rfq"],
    selectedSupplier: {
      selectionType:
        selectedSupplier.selectionType === "supplier" ||
        selectedSupplier.selectionType === "manager"
          ? selectedSupplier.selectionType
          : "none",
      supplierId:
        typeof selectedSupplier.supplierId === "string"
          ? selectedSupplier.supplierId
          : undefined,
      supplierName:
        typeof selectedSupplier.supplierName === "string"
          ? selectedSupplier.supplierName
          : undefined,
      region:
        typeof selectedSupplier.region === "string"
          ? selectedSupplier.region
          : undefined,
      processes: Array.isArray(selectedSupplier.processes)
        ? selectedSupplier.processes.filter(
            (process): process is string => typeof process === "string",
          )
        : undefined,
      matchReason:
        typeof selectedSupplier.matchReason === "string"
          ? selectedSupplier.matchReason
          : undefined,
    },
    contact: contact as RequestDraft["contact"],
    updatedAt:
      typeof draft.updatedAt === "string"
        ? draft.updatedAt
        : new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const draft = normalizeRequestDraft(body);

    if (!draft.contact.name?.trim() || !draft.contact.email?.trim()) {
      return NextResponse.json<SubmitRequestResponse>(
        {
          ok: false,
          message: "이름과 이메일은 필수 입력 항목입니다.",
        },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();
    const requestCode = generateRequestCode();
    const createdRequest = await createPrototypeRequest(
      supabase,
      draft,
      requestCode,
    );

    await createRequestFiles(supabase, createdRequest.id, draft.files);
    await createRfqDraft(supabase, createdRequest.id, draft.rfq);
    await createSupplierRecommendation(
      supabase,
      createdRequest.id,
      draft.selectedSupplier,
    );
    await createRequestStatusLog(supabase, createdRequest.id);

    return NextResponse.json<SubmitRequestResponse>({
      ok: true,
      requestId: createdRequest.id,
      requestCode: createdRequest.request_code,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json<SubmitRequestResponse>(
      {
        ok: false,
        message: genericErrorMessage,
      },
      { status: 500 },
    );
  }
}
