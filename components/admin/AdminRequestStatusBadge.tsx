import type { PrototypeRequestStatus } from "@/types/request";

const statusLabelMap: Record<string, string> = {
  draft: "작성 중",
  submitted: "접수 완료",
  reviewing: "검토 중",
  needs_info: "정보 보완 필요",
  supplier_recommended: "업체 추천 완료",
  quote_requested: "견적 요청 중",
  quote_received: "견적 회신 완료",
  in_production: "제작 진행 중",
  completed: "완료",
  on_hold: "보류",
  cancelled: "취소",
};

function getStatusClasses(status: PrototypeRequestStatus) {
  if (status === "submitted" || status === "reviewing") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "needs_info" || status === "on_hold") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "cancelled") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function getStatusLabel(status: PrototypeRequestStatus | null) {
  if (!status) {
    return "-";
  }

  return statusLabelMap[status] ?? status;
}

export function AdminRequestStatusBadge({
  status,
}: {
  status: PrototypeRequestStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${getStatusClasses(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
