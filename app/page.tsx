import { CtaSection } from "@/components/landing/CtaSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ServiceFlowSection } from "@/components/landing/ServiceFlowSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { TargetCustomerSection } from "@/components/landing/TargetCustomerSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ServiceFlowSection />
      <TargetCustomerSection />
      <CtaSection />
    </main>
  );
}
