"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RequestStepIndicator } from "@/components/request/RequestStepIndicator";
import {
  RfqFieldRow,
  type RfqFieldStatus,
  type RfqInputType,
} from "@/components/request/RfqFieldRow";
import {
  getRequestDraft,
  saveRequestDraft,
} from "@/lib/storage/requestDraftStorage";
import type { RfqDraft } from "@/types/request";

type RfqField = {
  description: string;
  inputType: RfqInputType;
  key: string;
  label: string;
  options?: string[];
  draftKey: keyof RfqDraft;
  status: RfqFieldStatus;
  value: string;
};

const initialFields: RfqField[] = [
  {
    key: "title",
    label: "의뢰 제목",
    description: "제작하려는 부품 또는 제품명을 입력하세요.",
    inputType: "text",
    draftKey: "title",
    status: "직접 입력",
    value: "",
  },
  {
    key: "description",
    label: "제품/부품 설명",
    description: "용도, 기능, 사용 환경을 간단히 설명하세요.",
    inputType: "textarea",
    draftKey: "partDescription",
    status: "직접 입력",
    value: "",
  },
  {
    key: "purpose",
    label: "제작 목적",
    description: "시제품 검증, 연구용, 전시용, 양산 전 테스트 등 목적을 입력하세요.",
    inputType: "select",
    draftKey: "purpose",
    status: "직접 입력",
    options: ["", "시제품 검증", "연구용", "전시용", "양산 전 테스트", "기타"],
    value: "",
  },
  {
    key: "recommendedProcesses",
    label: "추천 제작 공정",
    description: "입력 정보 기준으로 예상되는 제작 공정입니다.",
    inputType: "text",
    draftKey: "recommendedProcess",
    status: "AI 추천",
    value: "CNC 가공 · MCT 검토",
  },
  {
    key: "material",
    label: "소재",
    description: "알루미늄, 스틸, SUS, 플라스틱 등 희망 소재를 입력하세요.",
    inputType: "text",
    draftKey: "material",
    status: "확인 필요",
    value: "확인 필요",
  },
  {
    key: "quantity",
    label: "수량",
    description: "제작하려는 수량을 입력하세요.",
    inputType: "text",
    draftKey: "quantity",
    status: "직접 입력",
    value: "",
  },
  {
    key: "dimensions",
    label: "주요 치수",
    description: "대략적인 크기 또는 주요 치수를 입력하세요.",
    inputType: "text",
    draftKey: "mainDimensions",
    status: "확인 필요",
    value: "도면 확인 필요",
  },
  {
    key: "tolerance",
    label: "요구 공차",
    description: "정밀도 요구사항이 있다면 입력하세요.",
    inputType: "text",
    draftKey: "tolerance",
    status: "확인 필요",
    value: "일반 공차 또는 확인 필요",
  },
  {
    key: "postProcessing",
    label: "후처리",
    description: "아노다이징, 도장, 열처리, 표면처리 등 필요 여부를 입력하세요.",
    inputType: "text",
    draftKey: "postProcessing",
    status: "확인 필요",
    value: "없음 또는 확인 필요",
  },
  {
    key: "assemblyRequired",
    label: "조립 여부",
    description: "단품 제작인지, 조립이 필요한지 선택하세요.",
    inputType: "select",
    draftKey: "assemblyRequired",
    status: "직접 입력",
    options: ["단품 제작", "조립 필요", "확인 필요"],
    value: "확인 필요",
  },
  {
    key: "desiredLeadTime",
    label: "희망 납기",
    description: "원하는 제작 완료 시점을 입력하세요.",
    inputType: "text",
    draftKey: "desiredLeadTime",
    status: "직접 입력",
    value: "",
  },
  {
    key: "estimatedCostRange",
    label: "예상 견적 범위",
    description: "입력 정보 기준의 참고 견적 범위입니다.",
    inputType: "text",
    draftKey: "estimatedCostRange",
    status: "AI 추천",
    value: "100만 원 ~ 200만 원 수준",
  },
  {
    key: "estimatedSchedule",
    label: "예상 제작 일정",
    description: "입력 정보 기준의 참고 납기 범위입니다.",
    inputType: "text",
    draftKey: "estimatedLeadTime",
    status: "AI 추천",
    value: "영업일 기준 7~14일",
  },
  {
    key: "costDrivers",
    label: "견적 상승 요인",
    description: "비용에 영향을 줄 수 있는 요소입니다.",
    inputType: "textarea",
    draftKey: "costDrivers",
    status: "AI 추천",
    value: "공차 요구 수준, 후처리 여부, 형상 복잡도",
  },
  {
    key: "supplierQuestions",
    label: "업체 확인 필요사항",
    description: "제조업체가 확인해야 할 질문을 정리합니다.",
    inputType: "textarea",
    draftKey: "supplierQuestions",
    status: "AI 추천",
    value: "재질 확정 필요, 후처리 여부 확인 필요, 수량 확인 필요",
  },
  {
    key: "additionalRequests",
    label: "추가 요청사항",
    description: "기타 요청사항을 자유롭게 입력하세요.",
    inputType: "textarea",
    draftKey: "additionalRequests",
    status: "직접 입력",
    value: "",
  },
];

const missingInformation = ["소재", "수량", "요구 공차", "후처리 여부"];

export function RfqEditor() {
  const [fields, setFields] = useState(initialFields);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const savedRfq = getRequestDraft().rfq;
      setFields((currentFields) =>
        currentFields.map((field) => {
          if (
            Object.prototype.hasOwnProperty.call(savedRfq, field.draftKey) &&
            savedRfq[field.draftKey] !== undefined
          ) {
            return {
              ...field,
              value: savedRfq[field.draftKey] ?? "",
            };
          }

          return field;
        }),
      );
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const fieldCountByStatus = useMemo(
    () =>
      fields.reduce(
        (acc, field) => {
          acc[field.status] += 1;
          return acc;
        },
        {
          "AI 추천": 0,
          "직접 입력": 0,
          "확인 필요": 0,
        } satisfies Record<RfqFieldStatus, number>,
      ),
    [fields],
  );

  const updateField = (fieldKey: string, value: string) => {
    const targetField = fields.find((field) => field.key === fieldKey);

    setFields((currentFields) =>
      currentFields.map((field) =>
        field.key === fieldKey ? { ...field, value } : field,
      ),
    );

    if (targetField) {
      saveRequestDraft({
        rfq: {
          [targetField.draftKey]: value,
        },
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm sm:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              2단계 · 의뢰서 작성
            </div>
            <h1 className="mt-6 break-keep text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              제작의뢰서 정보를 정리해주세요
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              AI가 입력 정보와 첨부 파일을 바탕으로 제작의뢰서 초안을
              구성합니다. 알 수 없는 항목은 비워두고, 사용자가 직접 수정할 수
              있습니다.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <RequestStepIndicator currentStep={2} />
        </div>

        <section className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            AI 초안은 참고용입니다
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            AI가 제안한 제작방법, 예상 견적, 예상 납기는 참고 범위이며 실제
            제작 가능 여부와 최종 조건은 제조업체 검토 후 확정됩니다.
          </p>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <p className="text-sm font-semibold text-blue-700">
                제작의뢰서 입력 표
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                제조업체 검토에 필요한 정보를 정리합니다
              </h2>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700">
                  AI 추천 {fieldCountByStatus["AI 추천"]}
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-700">
                  직접 입력 {fieldCountByStatus["직접 입력"]}
                </span>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700">
                  확인 필요 {fieldCountByStatus["확인 필요"]}
                </span>
              </div>
            </div>

            <div>
              {fields.map((field) => (
                <RfqFieldRow
                  key={field.key}
                  description={field.description}
                  inputType={field.inputType}
                  label={field.label}
                  options={field.options}
                  status={field.status}
                  value={field.value}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
            </div>
          </section>

          <aside className="grid gap-6 self-start xl:sticky xl:top-6">
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                확인 필요 항목
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                아래 항목은 제조업체 견적 검토 전에 확인이 필요합니다.
              </p>
              <ul className="mt-5 grid gap-3">
                {missingInformation.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-800"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                예상 견적은 확정 금액이 아닙니다
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                표시된 예상 견적 범위와 제작 일정은 입력 정보 기반의
                참고값입니다. 실제 견적, 납기, 제작 가능 여부는 제조업체 검토
                후 확정됩니다.
              </p>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                의뢰서 초안을 확인했다면 다음 단계로 이동하세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                현재 입력값은 화면에서만 관리되며, 아직 AI 호출이나 DB 저장은
                수행하지 않습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request/upload"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
              >
                이전 단계로 돌아가기
              </Link>
              <Link
                href="/request/suppliers"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800"
              >
                추천 업체 확인하기
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
              >
                나중에 다시 작성하기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
