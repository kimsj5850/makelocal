import type { RfqDraft } from "@/types/request";
import type { Supplier } from "@/types/supplier";
import type { SupplierMatchResult } from "@/types/recommendation";

function normalize(value: string | null | undefined) {
  return (value ?? "").toLowerCase().replace(/\s+/g, "");
}

function includesEitherSide(a: string | null | undefined, b: string) {
  const left = normalize(a);
  const right = normalize(b);

  return Boolean(left && right && (left.includes(right) || right.includes(left)));
}

function findMatches(source: string | undefined, candidates: string[] | null | undefined) {
  if (!source || !candidates) {
    return [];
  }

  return candidates.filter((candidate) => includesEitherSide(source, candidate));
}

function needsPostProcessing(postProcessing: string | undefined) {
  const normalized = normalize(postProcessing);

  return Boolean(normalized && !normalized.includes("없음"));
}

function buildMatchReason({
  matchedMaterials,
  matchedProcesses,
  supplier,
}: {
  matchedMaterials: string[];
  matchedProcesses: string[];
  supplier: Supplier;
}) {
  const reasons: string[] = [];

  if (matchedProcesses.length > 0) {
    reasons.push(`${matchedProcesses.join("/")} 공정 대응 가능`);
  }

  if (matchedMaterials.length > 0) {
    reasons.push(`${matchedMaterials.join("/")} 소재 대응 가능`);
  }

  if (supplier.small_batch_available) {
    reasons.push("소량 시제품 제작 가능");
  }

  if (supplier.region?.includes("대구")) {
    reasons.push("대구권 제조업체");
  }

  if (supplier.post_processing_available) {
    reasons.push("후처리 대응 가능");
  }

  if (reasons.length === 0) {
    return "등록된 제조 역량 정보를 기준으로 검토가 필요한 업체입니다.";
  }

  return `${reasons.join(", ")}합니다.`;
}

export function recommendSuppliers(
  suppliers: Supplier[],
  rfq: RfqDraft,
): SupplierMatchResult[] {
  const sortedResults = suppliers
    .map((supplier) => {
      const matchedProcesses = findMatches(
        rfq.recommendedProcess,
        supplier.main_processes,
      );
      const matchedMaterials = findMatches(rfq.material, supplier.materials);
      let score = 0;

      if (matchedProcesses.length > 0) {
        score += 3;
      }

      if (matchedMaterials.length > 0) {
        score += 2;
      }

      if (supplier.small_batch_available) {
        score += 2;
      }

      if (supplier.region?.includes("대구")) {
        score += 1;
      }

      if (
        needsPostProcessing(rfq.postProcessing) &&
        supplier.post_processing_available
      ) {
        score += 1;
      }

      return {
        supplier,
        score,
        rank: 0,
        matchedProcesses,
        matchedMaterials,
        matchReason: buildMatchReason({
          matchedMaterials,
          matchedProcesses,
          supplier,
        }),
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (
        new Date(b.supplier.created_at).getTime() -
        new Date(a.supplier.created_at).getTime()
      );
    });

  return sortedResults.map((result, index) => ({
    ...result,
    rank: index + 1,
  }));
}
