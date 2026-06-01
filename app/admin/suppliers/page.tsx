import Link from "next/link";
import { AdminSupplierTable } from "@/components/admin/AdminSupplierTable";
import { listSuppliers } from "@/lib/supabase/suppliers";
import type { Supplier } from "@/types/supplier";

export const dynamic = "force-dynamic";

type AdminSuppliersPageProps = {
  searchParams: Promise<{
    created?: string;
  }>;
};

export default async function AdminSuppliersPage({
  searchParams,
}: AdminSuppliersPageProps) {
  const { created } = await searchParams;
  let suppliers: Supplier[] = [];
  let errorMessage = "";

  try {
    suppliers = await listSuppliers();
  } catch {
    errorMessage = "제조업체 데이터를 불러오는 중 문제가 발생했습니다.";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                개발용 관리자 화면
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                제조업체 DB 관리
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                메이크로컬 매칭에 활용할 제조업체 정보를 등록하고
                확인합니다. 현재는 개발용 조회/등록 관리자 화면입니다.
              </p>
            </div>
            <Link
              href="/admin/suppliers/new"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800"
            >
              새 제조업체 등록하기
            </Link>
          </div>

          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
            현재 제조업체 DB 관리 화면은 개발용 관리자 화면입니다. 실제 배포
            전에는 관리자 인증을 적용해야 합니다.
          </div>
        </section>

        {created === "1" ? (
          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            제조업체가 등록되었습니다.
          </section>
        ) : null}

        {errorMessage ? (
          <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
            {errorMessage}
          </section>
        ) : (
          <AdminSupplierTable suppliers={suppliers} />
        )}
      </div>
    </main>
  );
}
