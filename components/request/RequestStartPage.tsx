import { ButtonLink } from "@/components/ui/ButtonLink";
import { RequestStepIndicator } from "@/components/request/RequestStepIndicator";

const preparationItems = [
  "2D 도면 또는 3D 모델 파일",
  "제작하려는 부품 또는 제품 설명",
  "희망 재질",
  "수량",
  "원하는 납기",
  "공차 또는 정밀도 요구사항",
  "후처리 여부",
  "참고 이미지 또는 기존 제품 링크",
];

export function RequestStartPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              파일럿 서비스
            </div>
            <h1 className="mt-6 break-keep text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              제작 의뢰를 시작합니다
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              도면이나 제작 요구사항을 바탕으로 제작의뢰서를 정리하고,
              적합한 제조업체 후보를 추천받을 수 있습니다.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <RequestStepIndicator />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-blue-700">준비 정보</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              미리 준비하면 좋은 정보
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {preparationItems.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-6">
            <section className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                아직 도면이 없어도 괜찮습니다.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                스케치, 사진, 설명만으로도 제작 의뢰서 작성을 시작할 수
                있습니다. 부족한 정보는 다음 단계에서 보완할 수 있습니다.
              </p>
            </section>

            <section className="rounded-lg border border-cyan-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                예상 견적과 납기는 참고 범위입니다
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                AI가 제안하는 예상 견적과 납기는 입력 정보 기반의 참고
                범위이며, 실제 제작 가능 여부와 최종 조건은 제조업체 검토 후
                확정됩니다.
              </p>
            </section>
          </div>
        </div>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                준비가 되었다면 다음 단계로 이동하세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                다음 화면에서 파일 첨부 또는 도면 없이 진행하는 흐름을
                시작합니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/request/upload">
                다음 단계로 이동하기
              </ButtonLink>
              <ButtonLink href="/" variant="secondary">
                랜딩페이지로 돌아가기
              </ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
