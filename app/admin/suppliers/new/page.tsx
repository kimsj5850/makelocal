import { redirect } from "next/navigation";
import { AdminSupplierForm } from "@/components/admin/AdminSupplierForm";
import { createSupplier } from "@/lib/supabase/suppliers";
import type { CreateSupplierInput } from "@/types/supplier";

export const dynamic = "force-dynamic";

type AdminSupplierNewPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return getText(formData, key) === "true";
}

function getCommaSeparatedList(formData: FormData, key: string) {
  const rawValue = getText(formData, key);

  if (!rawValue) {
    return [];
  }

  return Array.from(
    new Set(
      rawValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

async function createSupplierAction(formData: FormData) {
  "use server";

  const companyName = getText(formData, "company_name");

  if (!companyName) {
    redirect("/admin/suppliers/new?error=company_name");
  }

  const input: CreateSupplierInput = {
    company_name: companyName,
    region: getText(formData, "region"),
    address: getText(formData, "address"),
    main_processes: getCommaSeparatedList(formData, "main_processes"),
    machines: getCommaSeparatedList(formData, "machines"),
    materials: getCommaSeparatedList(formData, "materials"),
    small_batch_available: getBoolean(formData, "small_batch_available"),
    post_processing_available: getBoolean(
      formData,
      "post_processing_available",
    ),
    average_lead_time: getText(formData, "average_lead_time"),
    contact_name: getText(formData, "contact_name"),
    phone: getText(formData, "phone"),
    email: getText(formData, "email"),
    website: getText(formData, "website"),
    description: getText(formData, "description"),
    admin_memo: getText(formData, "admin_memo"),
    is_active: getBoolean(formData, "is_active"),
  };

  try {
    await createSupplier(input);
  } catch {
    redirect("/admin/suppliers/new?error=submit");
  }

  redirect("/admin/suppliers?created=1");
}

export default async function AdminSupplierNewPage({
  searchParams,
}: AdminSupplierNewPageProps) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <span className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            개발용 관리자 화면
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            새 제조업체 등록
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            메이크로컬 매칭에 활용할 제조업체 정보를 등록합니다. 공정,
            장비, 소재는 쉼표로 구분해 입력하면 배열로 저장됩니다.
          </p>
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
            현재 제조업체 DB 관리 화면은 개발용 관리자 화면입니다. 실제 배포
            전에는 관리자 인증을 적용해야 합니다.
          </div>
        </section>

        <AdminSupplierForm formAction={createSupplierAction} error={error} />
      </div>
    </main>
  );
}
