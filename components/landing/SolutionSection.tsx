import { SectionContainer } from "@/components/common/SectionContainer";

const solutions = [
  {
    title: "도면 기반 제작방법 추천",
    body: "입력된 도면과 요구사항을 바탕으로 가능한 제작 공정과 검토 포인트를 정리합니다.",
  },
  {
    title: "제작의뢰서 자동 생성",
    body: "제조업체가 견적을 검토하기 쉬운 형태로 재질, 수량, 공차, 후처리, 납기 정보를 표준화합니다.",
  },
  {
    title: "지역 제조업체 추천",
    body: "공정, 소재, 지역, 소량 시제품 대응 여부를 기준으로 적합한 제조업체 후보를 추천합니다.",
  },
];

export function SolutionSection() {
  return (
    <SectionContainer className="bg-slate-50">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-blue-700">Solution</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
          메이크로컬이 제작 문의를 표준화합니다
        </h2>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {solutions.map((solution, index) => (
          <article
            key={solution.title}
            className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-blue-700">
              {index + 1}
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-950">
              {solution.title}
            </h3>
            <p className="mt-4 leading-7 text-slate-600">{solution.body}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
