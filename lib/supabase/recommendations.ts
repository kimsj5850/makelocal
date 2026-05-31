import type { SupabaseClient } from "@supabase/supabase-js";
import type { SelectedSupplierDraft } from "@/types/request";

export async function createSupplierRecommendation(
  supabase: SupabaseClient,
  requestId: string,
  selectedSupplier: SelectedSupplierDraft,
) {
  if (selectedSupplier.selectionType === "none") {
    return;
  }

  const isManagerDelegated = selectedSupplier.selectionType === "manager";

  const { error } = await supabase.from("supplier_recommendations").insert({
    request_id: requestId,
    supplier_id: null,
    recommendation_rank: null,
    score: null,
    match_reason: isManagerDelegated
      ? "메이크로컬 매니저 검토 요청"
      : selectedSupplier.matchReason ?? null,
    matched_processes: selectedSupplier.processes ?? [],
    is_user_selected: selectedSupplier.selectionType === "supplier",
    is_operator_delegated: isManagerDelegated,
    admin_selected: false,
  });

  if (error) {
    throw error;
  }
}
