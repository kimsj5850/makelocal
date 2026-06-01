import Link from "next/link";
import { AdminNoteForm } from "@/components/admin/AdminNoteForm";
import { AdminNoteList } from "@/components/admin/AdminNoteList";
import { AdminRequestStatusForm } from "@/components/admin/AdminRequestStatusForm";
import {
  AdminRequestStatusBadge,
  getStatusLabel,
} from "@/components/admin/AdminRequestStatusBadge";
import type {
  PrototypeRequestDetail,
  PrototypeRequestStatus,
  RfqDraft,
} from "@/types/request";

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

function displayValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim() ? value : "-";
  }

  if (typeof value === "number") {
    return value.toLocaleString("ko-KR");
  }

  if (typeof value === "boolean") {
    return value ? "예" : "아니오";
  }

  return "-";
}

function formatFileSize(value: number | null) {
  if (!value) {
    return "-";
  }

  const mb = value / 1024 / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(1)}MB`;
  }

  return `${Math.max(1, Math.round(value / 1024)).toLocaleString("ko-KR")}KB`;
}

function joinList(value: string[] | null | undefined) {
  if (!value || value.length === 0) {
    return "-";
  }

  return value.join(", ");
}

function displayListOrText(
  value: string[] | null | undefined,
  fallback: unknown,
) {
  if (value && value.length > 0) {
    return value.join(", ");
  }

  return displayValue(fallback);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getFinalRfq(finalRfq: unknown): Partial<RfqDraft> {
  if (!isRecord(finalRfq)) {
    return {};
  }

  return finalRfq as Partial<RfqDraft>;
}

function getEstimatedCost(detail: PrototypeRequestDetail) {
  const { rfqDraft } = detail;

  if (!rfqDraft) {
    return "-";
  }

  if (rfqDraft.estimated_cost_min || rfqDraft.estimated_cost_max) {
    const min = rfqDraft.estimated_cost_min
      ? `${rfqDraft.estimated_cost_min.toLocaleString("ko-KR")}원`
      : "-";
    const max = rfqDraft.estimated_cost_max
      ? `${rfqDraft.estimated_cost_max.toLocaleString("ko-KR")}원`
      : "-";

    return `${min} ~ ${max}`;
  }

  return displayValue(getFinalRfq(rfqDraft.final_rfq).estimatedCostRange);
}

function getEstimatedLeadTime(detail: PrototypeRequestDetail) {
  const { rfqDraft } = detail;

  if (!rfqDraft) {
    return "-";
  }

  if (
    rfqDraft.estimated_lead_time_min_days ||
    rfqDraft.estimated_lead_time_max_days
  ) {
    const min = rfqDraft.estimated_lead_time_min_days ?? "-";
    const max = rfqDraft.estimated_lead_time_max_days ?? "-";

    return `영업일 기준 ${min}~${max}일`;
  }

  return displayValue(getFinalRfq(rfqDraft.final_rfq).estimatedLeadTime);
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md bg-slate-50 p-4">
          <dt className="text-xs font-bold uppercase text-slate-500">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm font-semibold leading-6 text-slate-900">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function getSelectionTypeLabel(recommendation: {
  is_user_selected: boolean;
  is_operator_delegated: boolean;
}) {
  if (recommendation.is_user_selected) {
    return "업체 선택";
  }

  if (recommendation.is_operator_delegated) {
    return "매니저에게 맡기기";
  }

  return "선택 없음";
}

export function AdminRequestDetail({
  adminNoteAction,
  noteMessage,
  detail,
  statusAction,
  statusMessage,
}: {
  adminNoteAction: (formData: FormData) => void | Promise<void>;
  detail: PrototypeRequestDetail;
  noteMessage?: "success" | "error" | "empty";
  statusAction: (formData: FormData) => void | Promise<void>;
  statusMessage?: "success" | "error";
}) {
  const {
    adminNotes,
    request,
    files,
    rfqDraft,
    recommendations,
    statusLogs,
  } = detail;
  const finalRfq = getFinalRfq(rfqDraft?.final_rfq);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/admin/requests"
          className="inline-flex min-h-10 items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          목록으로 돌아가기
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  개발용 관리자 화면
                </span>
                <AdminRequestStatusBadge status={request.status} />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-500">
                {request.request_code}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {displayValue(request.title)}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                현재 관리자 기능은 개발용입니다. 실제 배포 전에는
                관리자 인증을 적용해야 합니다.
              </p>
            </div>

            <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm lg:min-w-80">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">제출일</span>
                <span className="font-bold text-slate-900">
                  {formatDateTime(request.submitted_at)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">의뢰자</span>
                <span className="font-bold text-slate-900">
                  {displayValue(request.contact_name)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">이메일</span>
                <span className="font-bold text-slate-900">
                  {displayValue(request.email)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">연락처</span>
                <span className="font-bold text-slate-900">
                  {displayValue(request.phone)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <AdminRequestStatusForm
            action={statusAction}
            currentStatus={request.status}
            message={statusMessage}
          />
          <AdminNoteForm action={adminNoteAction} message={noteMessage} />
        </div>

        <AdminNoteList notes={adminNotes} />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <DetailCard title="기본 정보">
            <InfoGrid
              items={[
                { label: "접수번호", value: request.request_code },
                {
                  label: "상태",
                  value: getStatusLabel(request.status),
                },
                { label: "의뢰 제목", value: displayValue(request.title) },
                {
                  label: "제품/부품 설명",
                  value: displayValue(request.description),
                },
                { label: "제작 목적", value: displayValue(request.purpose) },
                {
                  label: "제출일",
                  value: formatDateTime(request.submitted_at),
                },
                {
                  label: "최근 수정일",
                  value: formatDateTime(request.updated_at),
                },
              ]}
            />
          </DetailCard>

          <DetailCard title="연락처 정보">
            <InfoGrid
              items={[
                { label: "이름", value: displayValue(request.contact_name) },
                {
                  label: "회사명/소속",
                  value: displayValue(request.company_name),
                },
                { label: "이메일", value: displayValue(request.email) },
                { label: "휴대폰 번호", value: displayValue(request.phone) },
                {
                  label: "연락 선호 방식",
                  value: displayValue(request.preferred_contact),
                },
              ]}
            />
          </DetailCard>
        </div>

        <DetailCard title="첨부 파일">
          <p className="mb-4 text-sm leading-6 text-slate-600">
            현재는 실제 파일 업로드가 아니라 파일 메타데이터만 저장됩니다.
            다운로드 링크는 제공하지 않습니다.
          </p>
          {files.length === 0 ? (
            <div className="rounded-md bg-slate-50 p-5 text-sm font-semibold text-slate-600">
              첨부 파일이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="py-3 pr-4">원본 파일명</th>
                    <th className="px-4 py-3">파일 형식</th>
                    <th className="px-4 py-3">파일 크기</th>
                    <th className="px-4 py-3">저장 경로</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td className="py-4 pr-4 font-semibold text-slate-900">
                        {file.original_file_name}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {displayValue(file.file_type)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {formatFileSize(file.file_size)}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-600">
                        {displayValue(file.storage_path)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DetailCard>

        <DetailCard title="제작의뢰서 정보">
          {rfqDraft ? (
            <InfoGrid
              items={[
                {
                  label: "추천 제작 공정",
                  value: displayListOrText(
                    rfqDraft.recommended_processes,
                    finalRfq.recommendedProcess,
                  ),
                },
                { label: "소재", value: displayValue(rfqDraft.material) },
                { label: "수량", value: displayValue(rfqDraft.quantity) },
                {
                  label: "주요 치수",
                  value: displayValue(finalRfq.mainDimensions),
                },
                { label: "요구 공차", value: displayValue(rfqDraft.tolerance) },
                {
                  label: "후처리",
                  value: displayValue(rfqDraft.post_processing),
                },
                {
                  label: "희망 납기",
                  value: displayValue(finalRfq.desiredLeadTime),
                },
                {
                  label: "예상 견적 범위",
                  value: getEstimatedCost(detail),
                },
                {
                  label: "예상 제작 일정",
                  value: getEstimatedLeadTime(detail),
                },
                {
                  label: "견적 상승 요인",
                  value: displayListOrText(
                    rfqDraft.cost_drivers,
                    finalRfq.costDrivers,
                  ),
                },
                {
                  label: "업체 확인 필요사항",
                  value: displayListOrText(
                    rfqDraft.supplier_questions,
                    finalRfq.supplierQuestions,
                  ),
                },
                {
                  label: "추가 요청사항",
                  value: displayValue(finalRfq.additionalRequests),
                },
              ]}
            />
          ) : (
            <div className="rounded-md bg-slate-50 p-5 text-sm font-semibold text-slate-600">
              저장된 제작의뢰서 정보가 없습니다.
            </div>
          )}
        </DetailCard>

        <DetailCard title="추천 업체 선택">
          {recommendations.length === 0 ? (
            <div className="rounded-md bg-slate-50 p-5 text-sm font-semibold text-slate-600">
              선택된 추천 업체 정보가 없습니다.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-bold text-blue-700">
                    {getSelectionTypeLabel(recommendation)}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div>
                      <dt className="font-semibold text-slate-500">추천 사유</dt>
                      <dd className="mt-1 font-semibold leading-6 text-slate-900">
                        {displayValue(recommendation.match_reason)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">매칭 공정</dt>
                      <dd className="mt-1 font-semibold text-slate-900">
                        {joinList(recommendation.matched_processes)}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <dt className="font-semibold text-slate-500">
                          사용자 선택
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-900">
                          {displayValue(recommendation.is_user_selected)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">
                          매니저 위임
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-900">
                          {displayValue(recommendation.is_operator_delegated)}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </DetailCard>

        <DetailCard title="상태 변경 로그">
          {statusLogs.length === 0 ? (
            <div className="rounded-md bg-slate-50 p-5 text-sm font-semibold text-slate-600">
              상태 변경 로그가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="py-3 pr-4">변경 시각</th>
                    <th className="px-4 py-3">이전 상태</th>
                    <th className="px-4 py-3">변경 상태</th>
                    <th className="px-4 py-3">변경자</th>
                    <th className="px-4 py-3">메모</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statusLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-4 pr-4 text-slate-700">
                        {formatDateTime(log.created_at)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {getStatusLabel(
                          log.from_status as PrototypeRequestStatus | null,
                        )}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {getStatusLabel(log.to_status)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {displayValue(log.changed_by)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {displayValue(log.memo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DetailCard>
      </div>
    </main>
  );
}
