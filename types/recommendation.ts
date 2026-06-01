import type { Supplier } from "@/types/supplier";

export type {
  SelectedSupplierDraft as SupplierRecommendationDraft,
  SupplierRecommendationRecord,
} from "@/types/request";

export type SupplierMatchResult = {
  supplier: Supplier;
  score: number;
  rank: number;
  matchedProcesses: string[];
  matchedMaterials: string[];
  matchReason: string;
};
