import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CreateSupplierInput, Supplier } from "@/types/supplier";

function nullableText(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function nullableList(value: string[] | undefined) {
  return value && value.length > 0 ? value : null;
}

export async function listSuppliers() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Supplier[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getSupplierById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .maybeSingle<Supplier>();

  if (error) {
    throw error;
  }

  return data;
}

export async function createSupplier(input: CreateSupplierInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      company_name: input.company_name.trim(),
      region: nullableText(input.region),
      address: nullableText(input.address),
      main_processes: nullableList(input.main_processes),
      machines: nullableList(input.machines),
      materials: nullableList(input.materials),
      small_batch_available: input.small_batch_available ?? true,
      post_processing_available: input.post_processing_available ?? false,
      average_lead_time: nullableText(input.average_lead_time),
      contact_name: nullableText(input.contact_name),
      phone: nullableText(input.phone),
      email: nullableText(input.email),
      website: nullableText(input.website),
      description: nullableText(input.description),
      admin_memo: nullableText(input.admin_memo),
      is_active: input.is_active ?? true,
    })
    .select("*")
    .single<Supplier>();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Supplier was not created.");
  }

  return data;
}
