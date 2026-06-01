export const ALLOWED_FILE_EXTENSIONS = [
  "pdf",
  "step",
  "stp",
  "stl",
  "jpg",
  "jpeg",
  "png",
] as const;

export const MAX_UPLOAD_FILE_COUNT = 5;
export const MAX_UPLOAD_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  return extension ?? "";
}

export function isAllowedFileExtension(fileName: string) {
  return ALLOWED_FILE_EXTENSIONS.includes(
    getFileExtension(fileName) as (typeof ALLOWED_FILE_EXTENSIONS)[number],
  );
}

export function validateFinalUploadFiles(files: File[]) {
  if (files.length > MAX_UPLOAD_FILE_COUNT) {
    return "파일은 최대 5개까지 첨부할 수 있습니다.";
  }

  if (files.some((file) => !isAllowedFileExtension(file.name))) {
    return "지원하지 않는 파일 형식입니다.";
  }

  if (files.some((file) => file.size > MAX_UPLOAD_FILE_SIZE_BYTES)) {
    return "파일당 최대 20MB까지 첨부할 수 있습니다.";
  }

  return "";
}

export function formatUploadFileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(1)}MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("ko-KR")}KB`;
}
