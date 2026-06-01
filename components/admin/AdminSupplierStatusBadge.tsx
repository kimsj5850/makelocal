export function AdminSupplierStatusBadge({
  isActive,
}: {
  isActive: boolean | null | undefined;
}) {
  const active = isActive ?? false;
  const classes = active
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${classes}`}
    >
      {active ? "사용 중" : "비활성"}
    </span>
  );
}
