"use client";

export type SampleSupplier = {
  id: string;
  leadTime: string;
  machines: string[];
  materials: string[];
  name: string;
  processes: string[];
  rank: number;
  reason: string;
  region: string;
  smallBatchAvailable: boolean;
};

type SupplierRecommendationCardProps = {
  isSelected: boolean;
  onSelect: (supplierId: string) => void;
  supplier: SampleSupplier;
};

export function SupplierRecommendationCard({
  isSelected,
  onSelect,
  supplier,
}: SupplierRecommendationCardProps) {
  return (
    <article
      className={`rounded-lg border bg-white p-6 shadow-sm transition ${
        isSelected
          ? "border-blue-500 ring-4 ring-blue-100"
          : "border-slate-200 hover:border-blue-200"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-blue-700 px-2.5 py-1 text-xs font-bold text-white">
              추천 {supplier.rank}순위
            </span>
            {isSelected ? (
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                선택됨
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">
            {supplier.name}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {supplier.region}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(supplier.id)}
          className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition ${
            isSelected
              ? "bg-blue-700 text-white shadow-sm shadow-blue-700/20"
              : "border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50"
          }`}
        >
          {isSelected ? "선택됨" : "이 업체 선택"}
        </button>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoItem label="가능 공정" value={supplier.processes.join(", ")} />
        <InfoItem label="주요 장비" value={supplier.machines.join(", ")} />
        <InfoItem label="대응 소재" value={supplier.materials.join(", ")} />
        <InfoItem
          label="소량 시제품"
          value={supplier.smallBatchAvailable ? "가능" : "확인 필요"}
        />
        <InfoItem label="예상 납기" value={supplier.leadTime} />
      </dl>

      <div className="mt-6 rounded-md border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-bold text-blue-800">추천 이유</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {supplier.reason}
        </p>
      </div>
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-6 text-slate-900">
        {value}
      </dd>
    </div>
  );
}
