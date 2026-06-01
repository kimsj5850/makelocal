import { AdminRequestSummaryCards } from "@/components/admin/AdminRequestSummaryCards";
import { AdminRequestTable } from "@/components/admin/AdminRequestTable";
import { listPrototypeRequests } from "@/lib/supabase/requests";
import type { PrototypeRequestListItem } from "@/types/request";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  let requests: PrototypeRequestListItem[] = [];
  let errorMessage = "";

  try {
    requests = await listPrototypeRequests();
  } catch {
    errorMessage = "제작 문의 데이터를 불러오는 중 문제가 발생했습니다.";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <span className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            개발용 관리자 화면
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            제작 문의 관리
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            메이크로컬에 접수된 제작 문의를 확인합니다. 현재는 조회 전용
            관리자 화면입니다.
          </p>
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
            현재 관리자 페이지는 개발용 조회 화면입니다. 실제 배포 전에는
            관리자 인증을 적용해야 합니다.
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
            {errorMessage}
          </section>
        ) : (
          <>
            <AdminRequestSummaryCards requests={requests} />
            <AdminRequestTable requests={requests} />
          </>
        )}
      </div>
    </main>
  );
}
