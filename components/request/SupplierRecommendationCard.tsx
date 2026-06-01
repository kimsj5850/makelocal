"use client";

import type { SupplierMatchResult } from "@/types/recommendation";

type SupplierRecommendationCardProps = {
  isSelected: boolean;
  onSelect: (supplierId: string) => void;
  match: SupplierMatchResult;
};

export function SupplierRecommendationCard({
  isSelected,
  match,
  onSelect,
}: SupplierRecommendationCardProps) {
  const { supplier } = match;

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
              추천 {match.rank}순위
            </span>
            <span className="rounded-md border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700">
              추천 점수 {match.score}점
            </span>
            {isSelected ? (
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                선택됨
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">
            {supplier.company_name}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {supplier.region ?? "지역 미입력"}
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
        <InfoItem label="가능 공정" value={displayList(supplier.main_processes)} />
        <InfoItem label="주요 장비" value={displayList(supplier.machines)} />
        <InfoItem label="대응 소재" value={displayList(supplier.materials)} />
        <InfoItem
          label="소량 시제품"
          value={supplier.small_batch_available ? "가능" : "확인 필요"}
        />
        <InfoItem
          label="후처리"
          value={supplier.post_processing_available ? "가능" : "확인 필요"}
        />
        <InfoItem
          label="평균 납기"
          value={supplier.average_lead_time ?? "확인 필요"}
        />
      </dl>

      <div className="mt-6 rounded-md border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-bold text-blue-800">추천 이유</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {match.matchReason}
        </p>
      </div>
    </article>
  );
}

function displayList(value: string[] | null | undefined) {
  if (!value || value.length === 0) {
    return "확인 필요";
  }

  return value.join(", ");
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
