"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RequestStepIndicator } from "@/components/request/RequestStepIndicator";
import {
  SupplierRecommendationCard,
  type SampleSupplier,
} from "@/components/request/SupplierRecommendationCard";
import {
  getRequestDraft,
  updateRequestDraft,
} from "@/lib/storage/requestDraftStorage";

const sampleSuppliers: SampleSupplier[] = [
  {
    id: "daegu-precision",
    rank: 1,
    name: "대구정밀가공 샘플업체",
    region: "대구",
    processes: ["MCT", "CNC", "밀링"],
    machines: ["MCT 3대", "CNC 2대"],
    materials: ["알루미늄", "스틸", "SUS"],
    smallBatchAvailable: true,
    leadTime: "7~14일",
    reason: "알루미늄 소량 MCT 가공 대응 가능, 시제품 제작 경험 보유",
  },
  {
    id: "local-sheet-metal",
    rank: 2,
    name: "로컬판금 샘플업체",
    region: "대구",
    processes: ["판금", "레이저 절단", "용접"],
    machines: ["레이저 절단기", "절곡기", "용접기"],
    materials: ["스틸", "SUS", "알루미늄 판재"],
    smallBatchAvailable: true,
    leadTime: "5~10일",
    reason: "판금 케이스 및 브라켓류 시제품 제작에 적합",
  },
  {
    id: "prototype-studio",
    rank: 3,
    name: "시제품제작 샘플업체",
    region: "경북",
    processes: ["3D프린팅", "간이 가공", "후가공"],
    machines: ["FDM", "SLA", "소형 CNC"],
    materials: ["PLA", "ABS", "레진", "알루미늄 일부"],
    smallBatchAvailable: true,
    leadTime: "3~7일",
    reason: "초기 형상 검토와 빠른 시제품 제작에 적합",
  },
];

const recommendationTags = [
  "제작 공정",
  "지역",
  "소재 대응",
  "소량 시제품",
  "예상 납기",
];

export function SupplierSelectionStep() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const savedSelection = getRequestDraft().selectedSupplier;

      if (savedSelection.selectionType === "manager") {
        setSelectedOption("manager");
        return;
      }

      if (
        savedSelection.selectionType === "supplier" &&
        savedSelection.supplierId
      ) {
        setSelectedOption(savedSelection.supplierId);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const selectedSupplier = sampleSuppliers.find(
    (supplier) => supplier.id === selectedOption,
  );
  const isManagerSelected = selectedOption === "manager";

  const handleSupplierSelect = (supplierId: string) => {
    const supplier = sampleSuppliers.find(
      (sampleSupplier) => sampleSupplier.id === supplierId,
    );

    if (!supplier) {
      return;
    }

    setSelectedOption(supplier.id);
    updateRequestDraft("selectedSupplier", {
      selectionType: "supplier",
      supplierId: supplier.id,
      supplierName: supplier.name,
      region: supplier.region,
      processes: supplier.processes,
      matchReason: supplier.reason,
    });
  };

  const handleManagerSelect = () => {
    setSelectedOption("manager");
    updateRequestDraft("selectedSupplier", {
      selectionType: "manager",
      supplierName: "매니저에게 맡기기",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm sm:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              3단계 · 업체 추천
            </div>
            <h1 className="mt-6 break-keep text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              추천 제조업체 후보를 확인해주세요
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              제작의뢰서 정보를 바탕으로 공정, 지역, 소재, 소량 시제품 대응
              여부가 맞는 제조업체 후보를 추천합니다.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <RequestStepIndicator currentStep={3} />
        </div>

        <section className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">추천 기준</h2>
              <p className="mt-4 max-w-4xl leading-7 text-slate-600">
                초기 MVP에서는 제작 공정, 지역, 소재 대응 가능 여부, 소량
                시제품 가능 여부를 기준으로 업체 후보를 정렬합니다. 실제 연결
                가능 여부는 운영자 검토 후 안내됩니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
              {recommendationTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="grid gap-5">
            {sampleSuppliers.map((supplier) => (
              <SupplierRecommendationCard
                key={supplier.id}
                supplier={supplier}
                isSelected={selectedOption === supplier.id}
                onSelect={handleSupplierSelect}
              />
            ))}
          </section>

          <aside className="grid gap-6 self-start xl:sticky xl:top-6">
            <section
              className={`rounded-lg border p-6 shadow-sm transition ${
                isManagerSelected
                  ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-950">
                  잘 모르겠다면 매니저에게 맡기세요
                </h2>
                {isManagerSelected ? (
                  <span className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-blue-700">
                    선택됨
                  </span>
                ) : null}
              </div>
              <p className="mt-4 leading-7 text-slate-600">
                어떤 업체가 적합한지 판단하기 어렵다면 매니저가 의뢰 내용을
                검토한 뒤 적합한 제조업체 연결 가능성을 안내드립니다.
              </p>
              <button
                type="button"
                onClick={handleManagerSelect}
                className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isManagerSelected
                    ? "bg-blue-700 text-white shadow-sm shadow-blue-700/20"
                    : "border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                {isManagerSelected ? "매니저에게 맡기기 선택됨" : "매니저에게 맡기기"}
              </button>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-700">선택 상태</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {selectedSupplier
                  ? selectedSupplier.name
                  : isManagerSelected
                    ? "매니저에게 맡기기"
                    : "아직 선택 전입니다"}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {selectedSupplier
                  ? "선택한 업체 후보는 최종 확인 단계에서 다시 확인할 수 있습니다."
                  : isManagerSelected
                    ? "운영자가 의뢰 내용과 제조업체 조건을 검토해 연결 가능성을 안내합니다."
                    : "업체를 선택하지 않아도 다음 단계로 이동할 수 있으며, 운영자 검토 과정에서 적합한 후보를 확인할 수 있습니다."}
              </p>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            추천 업체는 확정 연결이 아닙니다
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            표시된 업체 후보는 입력 정보 기반의 추천 결과입니다. 실제 견적
            요청, 제작 가능 여부, 최종 조건은 운영자와 제조업체 검토 후
            확정됩니다.
          </p>
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                추천 후보를 확인했다면 최종 확인으로 이동하세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                선택값은 현재 화면에서만 관리되며, 아직 DB 저장이나 업체 연락은
                수행하지 않습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request/rfq"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
              >
                이전 단계로 돌아가기
              </Link>
              <Link
                href="/request/review"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800"
              >
                최종 내용 확인하기
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
              >
                나중에 다시 확인하기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
