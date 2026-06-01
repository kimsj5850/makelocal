"use client";

import { useFormStatus } from "react-dom";
import { getStatusLabel } from "@/components/admin/AdminRequestStatusBadge";
import type { PrototypeRequestStatus } from "@/types/request";

const statusOptions: PrototypeRequestStatus[] = [
  "submitted",
  "reviewing",
  "needs_info",
  "supplier_recommended",
  "quote_requested",
  "quote_received",
  "in_production",
  "completed",
  "on_hold",
  "cancelled",
];

type AdminRequestStatusFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  currentStatus: PrototypeRequestStatus;
  message?: "success" | "error";
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {pending ? "상태를 변경하는 중입니다..." : "상태 변경하기"}
    </button>
  );
}

export function AdminRequestStatusForm({
  action,
  currentStatus,
  message,
}: AdminRequestStatusFormProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-slate-950">상태 관리</h2>
        <p className="text-sm leading-6 text-slate-600">
          제작 문의의 현재 진행 상태를 변경합니다. 상태 변경 이력은 자동으로
          기록됩니다.
        </p>
        <p className="text-sm font-semibold text-amber-700">
          현재 관리자 기능은 개발용입니다. 실제 배포 전에는 관리자 인증을
          적용해야 합니다.
        </p>
      </div>

      {message === "success" ? (
        <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          상태가 변경되었습니다.
        </div>
      ) : null}
      {message === "error" ? (
        <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          상태 변경 중 문제가 발생했습니다. 다시 시도해주세요.
        </div>
      ) : null}

      <form action={action} className="mt-6 grid gap-5">
        <input type="hidden" name="fromStatus" value={currentStatus} />
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-800">상태 선택</span>
          <select
            name="toStatus"
            defaultValue={currentStatus}
            className="min-h-12 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-800">
            상태 변경 메모
          </span>
          <textarea
            name="memo"
            rows={4}
            placeholder="상태 변경 사유를 입력하세요. 예: 도면 검토 시작, 소재 정보 보완 필요"
            className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <div>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
