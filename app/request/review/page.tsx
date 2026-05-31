import { ContactForm } from "@/components/request/ContactForm";
import { RequestStepIndicator } from "@/components/request/RequestStepIndicator";
import { ReviewSummary } from "@/components/request/ReviewSummary";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm sm:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              4단계 · 최종 확인
            </div>
            <h1 className="mt-6 break-keep text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              제작 문의 내용을 최종 확인해주세요
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              제출 전 제작의뢰서, 추천 업체 선택, 연락처 정보를 확인해주세요.
              제출 후 메이크로컬 매니저가 내용을 검토한 뒤 연결 가능성을
              안내드립니다.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <RequestStepIndicator currentStep={4} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <ReviewSummary />
          <ContactForm />
        </div>

        <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            제출 전 확인해주세요
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            현재 단계에서는 실제 제조업체에 자동으로 견적 요청이 전달되지
            않습니다. 제출된 내용은 메이크로컬 매니저가 먼저 검토하며, 실제
            견적·납기·제작 가능 여부는 제조업체 확인 후 확정됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}
