import type { PrototypeRequestListItem } from "@/types/request";

export function AdminRequestSummaryCards({
  requests,
}: {
  requests: PrototypeRequestListItem[];
}) {
  const submittedCount = requests.filter(
    (request) => request.status === "submitted",
  ).length;
  const reviewingCount = requests.filter(
    (request) => request.status === "reviewing",
  ).length;
  const needsInfoCount = requests.filter(
    (request) => request.status === "needs_info",
  ).length;

  const cards = [
    { label: "전체 문의", value: requests.length },
    { label: "접수 완료", value: submittedCount },
    { label: "검토 중", value: reviewingCount },
    { label: "정보 보완 필요", value: needsInfoCount },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}
