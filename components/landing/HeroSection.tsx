import { SectionContainer } from "@/components/common/SectionContainer";
import { ButtonLink } from "@/components/ui/ButtonLink";

const previewItems = [
  {
    label: "도면 업로드",
    value: "bracket_v2.step",
    status: "검토 준비",
  },
  {
    label: "AI 제작방법 추천",
    value: "CNC 가공 · MCT 검토",
    status: "추천 완료",
  },
  {
    label: "예상 견적 범위",
    value: "120만 원 ~ 220만 원",
    status: "범위 안내",
  },
  {
    label: "제조업체 추천",
    value: "대구권 후보 5곳",
    status: "매칭 준비",
  },
];

export function HeroSection() {
  return (
    <SectionContainer className="bg-gradient-to-b from-blue-50 to-slate-50 pb-16 pt-10 sm:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
            AI 기반 제조 매칭 파일럿
          </div>
          <h1 className="mt-6 break-keep text-4xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl">
            시제품 제작, 업체 찾기부터 의뢰서 작성까지 한 번에
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            도면과 요구사항을 제작업체가 검토하기 쉬운 의뢰서로 정리하고,
            적합한 지역 중소 제조업체 후보를 추천하는 AI 기반 제조 매칭
            파일럿 서비스입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/request/start">제작 의뢰 시작하기</ButtonLink>
            <ButtonLink href="#flow" variant="secondary">
              서비스 흐름 보기
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <p className="rounded-md border border-slate-200 bg-white px-4 py-3">
              연구소·스타트업 대상
            </p>
            <p className="rounded-md border border-slate-200 bg-white px-4 py-3">
              운영자 검토 기반 MVP
            </p>
            <p className="rounded-md border border-slate-200 bg-white px-4 py-3">
              지역 제조업체 매칭
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-6">
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold">제작 문의 대시보드</p>
                <p className="mt-1 text-xs text-slate-300">시각적 mockup</p>
              </div>
              <div className="rounded-md bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                AI 분석 준비
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {previewItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-white/10 bg-white/[0.06] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-cyan-200">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-xs text-slate-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-md bg-blue-500/20 px-3 py-3">
                <p className="font-bold text-white">5</p>
                <p className="mt-1 text-slate-300">추천 후보</p>
              </div>
              <div className="rounded-md bg-cyan-400/20 px-3 py-3">
                <p className="font-bold text-white">3</p>
                <p className="mt-1 text-slate-300">검토 공정</p>
              </div>
              <div className="rounded-md bg-sky-400/20 px-3 py-3">
                <p className="font-bold text-white">7~14일</p>
                <p className="mt-1 text-slate-300">예상 납기</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            예상 견적과 납기는 참고 범위이며, 실제 조건은 제조업체 검토 후
            확정됩니다.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
