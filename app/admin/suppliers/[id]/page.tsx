import Link from "next/link";
import { AdminSupplierDetail } from "@/components/admin/AdminSupplierDetail";
import { getSupplierById } from "@/lib/supabase/suppliers";
import type { Supplier } from "@/types/supplier";

export const dynamic = "force-dynamic";

type AdminSupplierDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminSupplierDetailPage({
  params,
}: AdminSupplierDetailPageProps) {
  const { id } = await params;
  let supplier: Supplier | null = null;
  let errorMessage = "";
  let notFoundMessage = "";

  try {
    supplier = await getSupplierById(id);

    if (!supplier) {
      notFoundMessage = "해당 제조업체를 찾을 수 없습니다.";
    }
  } catch {
    errorMessage = "제조업체 데이터를 불러오는 중 문제가 발생했습니다.";
  }

  if (supplier) {
    return <AdminSupplierDetail supplier={supplier} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/admin/suppliers"
          className="inline-flex min-h-10 items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          목록으로 돌아가기
        </Link>
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            개발용 관리자 화면
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            {errorMessage || notFoundMessage}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            업체 ID를 다시 확인하거나 제조업체 목록에서 상세 보기를 다시
            선택해주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
