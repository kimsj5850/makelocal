import { SectionContainer } from "@/components/common/SectionContainer";

const customers = [
  "하드웨어 스타트업",
  "대학 및 연구소",
  "예비창업자",
  "제품 개발자",
  "창업보육센터 입주기업",
  "메이커스페이스 이용자",
];

export function TargetCustomerSection() {
  return (
    <SectionContainer className="bg-slate-50">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-blue-700">Target</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            이런 분들에게 필요합니다
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            초기 파일럿은 대구권 제조업체와 시제품 제작 수요자를 중심으로
            작게 검증하며, 이후 지역과 공정을 확장할 수 있도록 설계합니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {customers.map((customer) => (
            <div
              key={customer}
              className="rounded-md border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-900 shadow-sm"
            >
              {customer}
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
