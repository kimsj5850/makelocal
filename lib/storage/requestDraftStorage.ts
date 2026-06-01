import type { RequestDraft } from "@/types/request";

const REQUEST_DRAFT_KEY = "makelocal_request_draft";

function createDraftId() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultRequestDraft(): RequestDraft {
  return {
    draftId: createDraftId(),
    files: [],
    rfq: {},
    selectedSupplier: {
      selectionType: "none",
    },
    contact: {},
    updatedAt: new Date().toISOString(),
  };
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeFiles(value: Partial<RequestDraft>) {
  if (!Array.isArray(value.files)) {
    return [];
  }

  return value.files.map((file) => {
    const legacyFile = file as typeof file & {
      storage_path?: string;
      stored_file_name?: string;
      uploaded_at?: string;
    };
    const storagePath = file.storagePath ?? legacyFile.storage_path;

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      extension: file.extension,
      storagePath,
      storedFileName: file.storedFileName ?? legacyFile.stored_file_name,
      uploaded: file.uploaded ?? Boolean(storagePath),
      uploadedAt: file.uploadedAt ?? legacyFile.uploaded_at,
    };
  });
}

function normalizeRequestDraft(value: Partial<RequestDraft>): RequestDraft {
  const defaultDraft = createDefaultRequestDraft();

  return {
    draftId:
      typeof value.draftId === "string" && value.draftId.trim()
        ? value.draftId
        : defaultDraft.draftId,
    files: normalizeFiles(value),
    rfq: {
      ...defaultDraft.rfq,
      ...(value.rfq ?? {}),
    },
    selectedSupplier: {
      ...defaultDraft.selectedSupplier,
      ...(value.selectedSupplier ?? {}),
    },
    contact: {
      ...defaultDraft.contact,
      ...(value.contact ?? {}),
    },
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : defaultDraft.updatedAt,
  };
}

export function getRequestDraft(): RequestDraft {
  const defaultDraft = createDefaultRequestDraft();

  if (!canUseLocalStorage()) {
    return defaultDraft;
  }

  try {
    const storedValue = window.localStorage.getItem(REQUEST_DRAFT_KEY);

    if (!storedValue) {
      return defaultDraft;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<RequestDraft>;
    return normalizeRequestDraft(parsedValue);
  } catch {
    return defaultDraft;
  }
}

export function saveRequestDraft(partial: Partial<RequestDraft>): void {
  if (!canUseLocalStorage()) {
    return;
  }

  const currentDraft = getRequestDraft();
  const nextDraft = normalizeRequestDraft({
    ...currentDraft,
    ...partial,
    rfq: {
      ...currentDraft.rfq,
      ...(partial.rfq ?? {}),
    },
    selectedSupplier: {
      ...currentDraft.selectedSupplier,
      ...(partial.selectedSupplier ?? {}),
    },
    contact: {
      ...currentDraft.contact,
      ...(partial.contact ?? {}),
    },
    updatedAt: new Date().toISOString(),
  });

  window.localStorage.setItem(REQUEST_DRAFT_KEY, JSON.stringify(nextDraft));
}

export function updateRequestDraft<K extends keyof RequestDraft>(
  key: K,
  value: RequestDraft[K],
): void {
  saveRequestDraft({ [key]: value } as Partial<RequestDraft>);
}

export function clearRequestDraft(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(REQUEST_DRAFT_KEY);
}
