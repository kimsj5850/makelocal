"use client";

import { useEffect, useMemo, useState } from "react";
import { getRequestDraft } from "@/lib/storage/requestDraftStorage";
import type { RequestDraft } from "@/types/request";

const attachedFiles = ["bracket_v2.step", "reference_image.png"];

const fallbackRfqSummary = {
  title: "알루미늄 브라켓 시제품 제작",
  recommendedProcess: "CNC 가공 · MCT 검토",
  material: "확인 필요",
  quantity: "미입력",
  tolerance: "일반 공차 또는 확인 필요",
  postProcessing: "없음 또는 확인 필요",
  estimatedCostRange: "100만 원 ~ 200만 원 수준",
  estimatedLeadTime: "영업일 기준 7~14일",
};

const emptyDraft: RequestDraft = {
  files: [],
  rfq: {},
  selectedSupplier: {
    selectionType: "none",
  },
  contact: {},
  updatedAt: "",
};

function displayDraftValue(value: string | undefined, fallback: string) {
  if (value === undefined) {
    return fallback;
  }

  return value.trim() ? value : "미입력";
}

export function ReviewSummary() {
  const [draft, setDraft] = useState<RequestDraft>(emptyDraft);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      setDraft(getRequestDraft());
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const hasStoredFiles = draft.files.length > 0;
  const displayedFiles = hasStoredFiles
    ? draft.files.map((file) => file.name)
    : attachedFiles;

  const rfqSummary = useMemo(
    () => [
      {
        label: "의뢰 제목",
        value: displayDraftValue(draft.rfq.title, fallbackRfqSummary.title),
      },
      {
        label: "추천 제작 공정",
        value: displayDraftValue(
          draft.rfq.recommendedProcess,
          fallbackRfqSummary.recommendedProcess,
        ),
      },
      {
        label: "소재",
        value: displayDraftValue(
          draft.rfq.material,
          fallbackRfqSummary.material,
        ),
      },
      {
        label: "수량",
        value: displayDraftValue(
          draft.rfq.quantity,
          fallbackRfqSummary.quantity,
        ),
      },
      {
        label: "요구 공차",
        value: displayDraftValue(
          draft.rfq.tolerance,
          fallbackRfqSummary.tolerance,
        ),
      },
      {
        label: "후처리",
        value: displayDraftValue(
          draft.rfq.postProcessing,
          fallbackRfqSummary.postProcessing,
        ),
      },
      {
        label: "예상 견적 범위",
        value: displayDraftValue(
          draft.rfq.estimatedCostRange,
          fallbackRfqSummary.estimatedCostRange,
        ),
      },
      {
        label: "예상 제작 일정",
        value: displayDraftValue(
          draft.rfq.estimatedLeadTime,
          fallbackRfqSummary.estimatedLeadTime,
        ),
      },
    ],
    [draft.rfq],
  );

  const selectedSupplierName =
    draft.selectedSupplier.selectionType === "supplier"
      ? draft.selectedSupplier.supplierName || "선택한 제조업체"
      : "매니저에게 맡기기";
  const selectedSupplierDescription =
    draft.selectedSupplier.selectionType === "supplier"
      ? `${draft.selectedSupplier.region ?? "지역 확인 필요"} · ${
          draft.selectedSupplier.processes?.join(", ") ?? "공정 확인 필요"
        }`
      : "메이크로컬 매니저가 의뢰 내용을 검토한 뒤 적합한 제조업체 후보를 안내드립니다.";

  return (
    <section className="grid gap-6">
      <SummaryCard title="첨부 파일">
        <ul className="grid gap-3">
          {displayedFiles.map((fileName) => (
            <li
              key={fileName}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900"
            >
              <span>{fileName}</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                {hasStoredFiles ? "임시 저장" : "샘플"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          파일이 없어도 문의는 제출할 수 있습니다.
        </p>
      </SummaryCard>

      <SummaryCard title="제작의뢰서 요약">
        <dl className="grid gap-3 sm:grid-cols-2">
          {rfqSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <dt className="text-xs font-semibold text-slate-500">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold leading-6 text-slate-950">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </SummaryCard>

      <SummaryCard title="추천 업체 선택">
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
          <p className="text-lg font-bold text-slate-950">
            {selectedSupplierName}
          </p>
          <p className="mt-3 leading-7 text-slate-600">
            {selectedSupplierDescription}
          </p>
          {draft.selectedSupplier.matchReason ? (
            <p className="mt-3 text-sm leading-6 text-blue-800">
              추천 이유: {draft.selectedSupplier.matchReason}
            </p>
          ) : null}
        </div>
      </SummaryCard>
    </section>
  );
}

function SummaryCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </article>
  );
}
