import type { SupabaseClient } from "@supabase/supabase-js";
import { getFileExtension } from "@/lib/storage/fileValidation";
import type { RequestFileDraft, RequestFileRecord } from "@/types/request";

const REQUEST_FILES_BUCKET = "request-files";

type LegacyRequestFileDraft = RequestFileDraft & {
  file_size?: number;
  file_type?: string;
  original_file_name?: string;
  storage_path?: string;
  stored_file_name?: string;
  uploaded_at?: string;
};

export function toSafeFileName(fileName: string) {
  const safeName = fileName
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.\-가-힣]/g, "_");

  return safeName || "file";
}

export async function createRequestFiles(
  supabase: SupabaseClient,
  requestId: string,
  files: RequestFileDraft[],
) {
  if (files.length === 0) {
    return;
  }

  const { error } = await supabase.from("request_files").insert(
    files.map((file) => {
      const legacyFile = file as LegacyRequestFileDraft;

      return {
        request_id: requestId,
        original_file_name: legacyFile.original_file_name ?? file.name,
        stored_file_name:
          file.storedFileName ?? legacyFile.stored_file_name ?? file.name,
        storage_path:
          file.storagePath ??
          legacyFile.storage_path ??
          `local-only/${requestId}/${encodeURIComponent(file.name)}`,
        file_type: legacyFile.file_type ?? file.extension ?? file.type,
        file_size: legacyFile.file_size ?? file.size,
      };
    }),
  );

  if (error) {
    throw error;
  }
}

export async function uploadDraftFilesToStorage(
  supabase: SupabaseClient,
  draftId: string,
  files: File[],
) {
  if (files.length === 0) {
    return [];
  }

  const uploadedStoragePaths: string[] = [];
  const uploadedFiles: RequestFileDraft[] = [];
  const timestamp = Date.now();

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const extension = getFileExtension(file.name);
      const safeFileName = `${timestamp}_${index + 1}_${toSafeFileName(file.name)}`;
      const storagePath = `drafts/${draftId}/${safeFileName}`;
      const { error: uploadError } = await supabase.storage
        .from(REQUEST_FILES_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type || undefined,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedStoragePaths.push(storagePath);
      uploadedFiles.push({
        id: `${storagePath}-${file.size}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        extension,
        storagePath,
        storedFileName: safeFileName,
        uploaded: true,
        uploadedAt: new Date().toISOString(),
      });
    }

    return uploadedFiles;
  } catch (error) {
    if (uploadedStoragePaths.length > 0) {
      await supabase.storage
        .from(REQUEST_FILES_BUCKET)
        .remove(uploadedStoragePaths);
    }

    throw error;
  }
}

export async function uploadRequestFiles(
  supabase: SupabaseClient,
  requestId: string,
  files: File[],
) {
  if (files.length === 0) {
    return;
  }

  const uploadedStoragePaths: string[] = [];
  const uploadedRows = [];
  const timestamp = Date.now();

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const safeFileName = `${timestamp}_${index + 1}_${toSafeFileName(file.name)}`;
      const storagePath = `requests/${requestId}/${safeFileName}`;
      const { error: uploadError } = await supabase.storage
        .from(REQUEST_FILES_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type || undefined,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedStoragePaths.push(storagePath);
      uploadedRows.push({
        request_id: requestId,
        original_file_name: file.name,
        stored_file_name: safeFileName,
        storage_path: storagePath,
        file_type: getFileExtension(file.name) || file.type,
        file_size: file.size,
      });
    }

    const { error } = await supabase.from("request_files").insert(uploadedRows);

    if (error) {
      throw error;
    }
  } catch (error) {
    if (uploadedStoragePaths.length > 0) {
      await supabase.storage
        .from(REQUEST_FILES_BUCKET)
        .remove(uploadedStoragePaths);
    }

    throw error;
  }
}

export async function attachSignedUrlsToRequestFiles(
  supabase: SupabaseClient,
  files: RequestFileRecord[],
) {
  return Promise.all(
    files.map(async (file) => {
      if (!file.storage_path || file.storage_path.startsWith("local-only/")) {
        return {
          ...file,
          signedUrl: null,
        };
      }

      const { data, error } = await supabase.storage
        .from(REQUEST_FILES_BUCKET)
        .createSignedUrl(file.storage_path, 60 * 10, {
          download: file.original_file_name,
        });

      return {
        ...file,
        signedUrl: error ? null : data?.signedUrl ?? null,
      };
    }),
  );
}
