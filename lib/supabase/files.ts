import type { SupabaseClient } from "@supabase/supabase-js";
import type { RequestFileDraft } from "@/types/request";

export async function createRequestFiles(
  supabase: SupabaseClient,
  requestId: string,
  files: RequestFileDraft[],
) {
  if (files.length === 0) {
    return;
  }

  const { error } = await supabase.from("request_files").insert(
    files.map((file) => ({
      request_id: requestId,
      original_file_name: file.name,
      stored_file_name: file.name,
      storage_path: `local-only/${requestId}/${encodeURIComponent(file.name)}`,
      file_type: file.extension || file.type,
      file_size: file.size,
    })),
  );

  if (error) {
    throw error;
  }
}
