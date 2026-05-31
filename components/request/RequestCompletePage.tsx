"use client";

import Link from "next/link";
import { RequestStepIndicator } from "@/components/request/RequestStepIndicator";
import { clearRequestDraft } from "@/lib/storage/requestDraftStorage";

const nextSteps = [
  {
    title: "매니저 검토",
    description: "제출된 제작의뢰서와 첨부 파일을 검토합니다.",
  },
  {
    title: "정보 보완 확인",
    description:
      "소재, 수량, 공차, 후처리 등 추가 확인이 필요한 항목을 정리합니다.",
  },
  {
    title: "제조업체 연결 가능성 안내",
    description: "적합한 제조업체 후보와 연결 가능성을 안내드립니다.",
  },
  {
    title: "견적 조건 확인",
    description:
      "실제 견적, 납기, 제작 가능 여부는 제조업체 검토 후 확정됩니다.",
  },
];

const receiptItems = [
  { label: "접수 상태", value: "파일럿 문의 접수 완료" },
  { label: "검토 방식", value: "메이크로컬 매니저 검토" },
  { label: "예상 안내", value: "영업일 기준 1~3일 내 검토 예정" },
  { label: "접수번호", value: "MCL-샘플-0001" },
];

export function RequestCompletePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
                5단계 · 문의 접수
              </div>
              <h1 className="mt-6 break-keep text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                제작 문의가 접수되었습니다
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                제출된 내용은 메이크로컬 매니저가 먼저 검토한 뒤, 적합한
                제조업체 연결 가능성을 안내드립니다.
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-4xl font-bold text-white shadow-sm shadow-blue-700/20">
                ✓
              </div>
              <p className="mt-5 text-sm font-semibold text-blue-700">
                접수 완료
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                샘플 접수 화면이며 실제 저장은 아직 수행하지 않습니다.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <RequestStepIndicator currentStep={5} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-blue-700">다음 절차</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              앞으로 이렇게 진행됩니다
            </h2>

            <ol className="mt-6 grid gap-4">
              {nextSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[48px_1fr] sm:items-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <aside className="grid gap-6 self-start xl:sticky xl:top-6">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-950">
                  접수 정보
                </h2>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  예시
                </span>
              </div>

              <dl className="mt-6 grid gap-3">
                {receiptItems.map((item) => (
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

              <p className="mt-4 text-sm leading-6 text-slate-600">
                위 접수번호는 샘플이며 실제 접수번호 생성 기능은 아직
                구현되지 않았습니다.
              </p>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                다음 작업을 선택하세요
              </h2>
              <div className="mt-5 grid gap-3">
                <Link
                  href="/request/start"
                  onClick={() => clearRequestDraft()}
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  새 제작 문의 시작하기
                </Link>
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  랜딩페이지로 돌아가기
                </Link>
                <Link
                  href="/#flow"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  서비스 흐름 다시 보기
                </Link>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            아직 제조업체에 자동 전달되지 않았습니다
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            현재 MVP 단계에서는 제출된 내용을 메이크로컬 매니저가 먼저
            검토합니다. 실제 제조업체 견적 요청, 제작 가능 여부, 최종 비용과
            납기는 검토 이후 별도로 안내됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}
