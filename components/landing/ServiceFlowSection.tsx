import { SectionContainer } from "@/components/common/SectionContainer";

const steps = [
  {
    title: "도면 업로드",
    body: "PDF, STEP, STL, JPG, PNG 도면 또는 참고 파일을 준비합니다.",
  },
  {
    title: "AI 분석",
    body: "도면과 요구사항을 바탕으로 제작 공정과 검토 포인트를 정리합니다.",
  },
  {
    title: "의뢰서 자동 생성",
    body: "재질, 수량, 공차, 후처리, 납기 정보를 제작업체 검토 형식으로 정리합니다.",
  },
  {
    title: "제조업체 추천",
    body: "공정, 지역, 소재, 소량 대응 여부를 기준으로 후보 업체를 추립니다.",
  },
  {
    title: "제작 문의 제출",
    body: "운영자가 의뢰 내용을 검토한 뒤 연결 가능성을 안내합니다.",
  },
];

export function ServiceFlowSection() {
  return (
    <SectionContainer className="bg-white" id="flow">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-blue-700">Flow</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
          서비스 흐름
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          도면을 올리는 순간부터 제조업체가 검토할 수 있는 문의 형태까지,
          필요한 정보를 단계별로 정리합니다.
        </p>
      </div>
      <ol className="mt-12 grid gap-5 md:grid-cols-5">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative rounded-lg border border-slate-200 bg-slate-50 p-5"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-700 text-sm font-bold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 font-bold leading-6 text-slate-950">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
