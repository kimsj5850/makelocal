import type { AdminNoteRecord } from "@/types/request";

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

export function AdminNoteList({ notes }: { notes: AdminNoteRecord[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">관리자 메모 목록</h2>
      {notes.length === 0 ? (
        <div className="mt-5 rounded-md bg-slate-50 p-5 text-sm font-semibold text-slate-600">
          아직 등록된 관리자 메모가 없습니다.
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-slate-950">
                  {note.created_by || "admin"}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {formatDateTime(note.created_at)}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {note.note}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
