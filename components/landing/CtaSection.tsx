import { SectionContainer } from "@/components/common/SectionContainer";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function CtaSection() {
  return (
    <SectionContainer className="bg-slate-950 text-white">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-cyan-300">Final CTA</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            지금 시제품 제작 문의를 시작해보세요
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            초기 파일럿 단계에서는 운영자가 의뢰 내용을 검토한 뒤 적합한
            제조업체 연결 가능성을 안내드립니다.
          </p>
        </div>
        <ButtonLink href="/request/start" variant="secondary">
          제작 의뢰 시작하기
        </ButtonLink>
      </div>
    </SectionContainer>
  );
}
