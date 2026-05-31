const requestSteps = [
  {
    title: "파일 첨부",
    description: "도면, 모델, 이미지 또는 참고 자료를 첨부합니다.",
  },
  {
    title: "의뢰서 작성",
    description: "제작 목적, 재질, 수량, 납기 등 핵심 정보를 정리합니다.",
  },
  {
    title: "업체 추천",
    description: "공정과 지역 조건에 맞는 제조업체 후보를 확인합니다.",
  },
  {
    title: "최종 확인",
    description: "의뢰 내용과 연락처를 제출 전 다시 확인합니다.",
  },
  {
    title: "문의 접수",
    description: "운영자가 검토한 뒤 연결 가능성을 안내합니다.",
  },
];

type RequestStepIndicatorProps = {
  currentStep?: number;
};

export function RequestStepIndicator({
  currentStep,
}: RequestStepIndicatorProps) {
  return (
    <section
      aria-labelledby="request-flow-title"
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">진행 단계</p>
          <h2
            id="request-flow-title"
            className="mt-2 break-keep text-2xl font-bold text-slate-950"
          >
            제작 의뢰는 이렇게 진행됩니다
          </h2>
        </div>
        <p className="text-sm leading-6 text-slate-500">
          {currentStep
            ? `현재 ${currentStep}단계: ${requestSteps[currentStep - 1]?.title}`
            : "현재는 시작 전 안내 단계입니다."}
        </p>
      </div>

      <ol className="mt-8 grid gap-4 lg:grid-cols-5">
        {requestSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={step.title}
              className={`rounded-lg border p-5 ${
                isCurrent
                  ? "border-blue-200 bg-blue-50 shadow-sm shadow-blue-700/10"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold ${
                  isCurrent
                    ? "bg-blue-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {stepNumber}
              </div>
              <h3 className="mt-5 font-bold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
