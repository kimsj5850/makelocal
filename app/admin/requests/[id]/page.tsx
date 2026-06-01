import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminRequestDetail } from "@/components/admin/AdminRequestDetail";
import {
  createAdminNote,
  getPrototypeRequestDetail,
  updatePrototypeRequestStatus,
} from "@/lib/supabase/requests";

export const dynamic = "force-dynamic";

type AdminRequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    noteError?: string;
    noteSaved?: string;
    statusError?: string;
    statusUpdated?: string;
  }>;
};

export default async function AdminRequestDetailPage({
  params,
  searchParams,
}: AdminRequestDetailPageProps) {
  const { id } = await params;
  const { noteError, noteSaved, statusError, statusUpdated } =
    await searchParams;
  let errorMessage = "";
  let notFoundMessage = "";
  let detail = null;

  try {
    detail = await getPrototypeRequestDetail(id);

    if (!detail) {
      notFoundMessage = "해당 제작 문의를 찾을 수 없습니다.";
    }
  } catch {
    errorMessage = "제작 문의 데이터를 불러오는 중 문제가 발생했습니다.";
  }

  if (detail) {
    const updateStatusAction = async (formData: FormData) => {
      "use server";

      const fromStatus = String(formData.get("fromStatus") ?? "");
      const toStatus = String(formData.get("toStatus") ?? "");
      const memo = String(formData.get("memo") ?? "");

      try {
        await updatePrototypeRequestStatus({
          requestId: id,
          fromStatus,
          toStatus,
          memo,
        });
      } catch {
        redirect(`/admin/requests/${id}?statusError=1`);
      }

      redirect(`/admin/requests/${id}?statusUpdated=1`);
    };

    const createAdminNoteAction = async (formData: FormData) => {
      "use server";

      const note = String(formData.get("note") ?? "").trim();

      if (!note) {
        redirect(`/admin/requests/${id}?noteError=empty`);
      }

      try {
        await createAdminNote({
          requestId: id,
          note,
          createdBy: "admin",
        });
      } catch {
        redirect(`/admin/requests/${id}?noteError=1`);
      }

      redirect(`/admin/requests/${id}?noteSaved=1`);
    };

    const statusMessage =
      statusUpdated === "1"
        ? "success"
        : statusError === "1"
          ? "error"
          : undefined;
    const noteMessage =
      noteSaved === "1"
        ? "success"
        : noteError === "empty"
          ? "empty"
          : noteError === "1"
            ? "error"
            : undefined;

    return (
      <AdminRequestDetail
        adminNoteAction={createAdminNoteAction}
        detail={detail}
        noteMessage={noteMessage}
        statusAction={updateStatusAction}
        statusMessage={statusMessage}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/admin/requests"
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
            접수 ID를 다시 확인하거나 제작 문의 목록에서 상세 보기를 다시
            선택해주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
