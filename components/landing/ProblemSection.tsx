import { SectionContainer } from "@/components/common/SectionContainer";

const problemGroups = [
  {
    title: "시제품 제작자의 문제",
    items: [
      "적합한 제조업체 탐색이 어려움",
      "재질·수량·공차·후처리 전달 반복",
      "견적 비교와 일정 관리에 시간 소요",
    ],
  },
  {
    title: "지역 제조업체의 문제",
    items: [
      "기술력은 있지만 신규 수주 채널이 부족함",
      "소수 고객사 의존으로 수주가 불안정",
      "온라인 수주 채널과 디지털 영업 기반 부족",
    ],
  },
];

export function ProblemSection() {
  return (
    <SectionContainer className="bg-white">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-blue-700">Problem</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
          시제품 제작은 도면만으로 끝나지 않습니다
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          제작자는 적합한 업체를 찾기 어렵고, 지역 제조업체는 기술력이
          있어도 새로운 수주 채널이 부족합니다.
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {problemGroups.map((group) => (
          <article
            key={group.title}
            className="rounded-lg border border-slate-200 bg-slate-50 p-7 shadow-sm"
          >
            <h3 className="text-xl font-bold text-slate-950">{group.title}</h3>
            <ul className="mt-6 space-y-4">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-blue-600" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
