import type { RequestDraft } from "@/types/request";

const REQUEST_DRAFT_KEY = "makelocal_request_draft";

function createDefaultRequestDraft(): RequestDraft {
  return {
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

function normalizeRequestDraft(value: Partial<RequestDraft>): RequestDraft {
  const defaultDraft = createDefaultRequestDraft();

  return {
    files: Array.isArray(value.files) ? value.files : defaultDraft.files,
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
