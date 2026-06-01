"use client";

import { useFormStatus } from "react-dom";

type AdminNoteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  message?: "success" | "error" | "empty";
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {pending ? "메모를 저장하는 중입니다..." : "메모 저장하기"}
    </button>
  );
}

export function AdminNoteForm({ action, message }: AdminNoteFormProps) {
  const messageText =
    message === "success"
      ? "메모가 저장되었습니다."
      : message === "empty"
        ? "메모 내용을 입력해주세요."
        : message === "error"
          ? "메모 저장 중 문제가 발생했습니다. 다시 시도해주세요."
          : "";

  const messageClasses =
    message === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-950">관리자 메모</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          고객 통화 내용, 보완 필요사항, 업체 문의 진행 상황 등을 기록합니다.
        </p>
      </div>

      {messageText ? (
        <div
          className={`mt-5 rounded-md border p-4 text-sm font-semibold ${messageClasses}`}
        >
          {messageText}
        </div>
      ) : null}

      <form action={action} className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-800">메모 내용</span>
          <textarea
            name="note"
            rows={5}
            placeholder="관리자 메모를 입력하세요."
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
