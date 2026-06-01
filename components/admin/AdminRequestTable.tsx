import Link from "next/link";
import { AdminRequestStatusBadge } from "@/components/admin/AdminRequestStatusBadge";
import type { PrototypeRequestListItem } from "@/types/request";

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

function displayValue(value: string | null) {
  return value?.trim() ? value : "-";
}

export function AdminRequestTable({
  requests,
}: {
  requests: PrototypeRequestListItem[];
}) {
  if (requests.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          아직 접수된 제작 문의가 없습니다.
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          사용자가 제작 문의를 제출하면 이 화면에 최신순으로 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">접수번호</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">의뢰 제목</th>
              <th className="px-4 py-3">의뢰자</th>
              <th className="px-4 py-3">회사명/소속</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">휴대폰 번호</th>
              <th className="px-4 py-3">제출일</th>
              <th className="px-4 py-3">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map((request) => (
              <tr key={request.id} className="align-top">
                <td className="px-4 py-4 font-bold text-slate-950">
                  {request.request_code}
                </td>
                <td className="px-4 py-4">
                  <AdminRequestStatusBadge status={request.status} />
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {displayValue(request.title)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayValue(request.contact_name)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayValue(request.company_name)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayValue(request.email)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayValue(request.phone)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {formatDateTime(request.submitted_at)}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
                  >
                    상세 보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
