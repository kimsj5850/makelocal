import Link from "next/link";
import { AdminSupplierStatusBadge } from "@/components/admin/AdminSupplierStatusBadge";
import type { Supplier } from "@/types/supplier";

function displayValue(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

function displayList(value: string[] | null | undefined) {
  if (!value || value.length === 0) {
    return "-";
  }

  return value.join(", ");
}

function displayBoolean(value: boolean | null | undefined) {
  return value ? "가능" : "불가능";
}

export function AdminSupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  if (suppliers.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          아직 등록된 제조업체가 없습니다.
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          새 제조업체를 등록하면 이 화면에 최신순으로 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">업체명</th>
              <th className="px-4 py-3">지역</th>
              <th className="px-4 py-3">가능 공정</th>
              <th className="px-4 py-3">대응 소재</th>
              <th className="px-4 py-3">소량 시제품</th>
              <th className="px-4 py-3">후처리</th>
              <th className="px-4 py-3">평균 납기</th>
              <th className="px-4 py-3">사용 여부</th>
              <th className="px-4 py-3">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="align-top">
                <td className="px-4 py-4 font-bold text-slate-950">
                  {supplier.company_name}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayValue(supplier.region)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayList(supplier.main_processes)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayList(supplier.materials)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayBoolean(supplier.small_batch_available)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayBoolean(supplier.post_processing_available)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {displayValue(supplier.average_lead_time)}
                </td>
                <td className="px-4 py-4">
                  <AdminSupplierStatusBadge isActive={supplier.is_active} />
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/suppliers/${supplier.id}`}
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
