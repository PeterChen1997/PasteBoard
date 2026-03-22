import {
  type CreateThreadInput,
  type PasteMutationMode,
  type UpdatePasteInput,
} from "@/lib/types";

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateThreadInput(
  payload: unknown
): ValidationResult<CreateThreadInput> {
  if (!isRecord(payload) || typeof payload.title !== "string") {
    return { success: false, error: "A thread title is required." };
  }

  const title = payload.title.trim();

  if (!title) {
    return { success: false, error: "A thread title is required." };
  }

  if (title.length > 120) {
    return {
      success: false,
      error: "Thread titles must be 120 characters or fewer.",
    };
  }

  return { success: true, data: { title } };
}

export function validatePasteInput(
  payload: unknown
): ValidationResult<{ content: string }> {
  if (!isRecord(payload) || typeof payload.content !== "string") {
    return { success: false, error: "Paste content is required." };
  }

  if (!payload.content.trim()) {
    return { success: false, error: "Paste content cannot be empty." };
  }

  return {
    success: true,
    data: { content: payload.content },
  };
}

export function validatePasteUpdateInput(
  payload: unknown
): ValidationResult<UpdatePasteInput> {
  if (
    !isRecord(payload) ||
    typeof payload.content !== "string" ||
    (payload.mode !== "replace" && payload.mode !== "append")
  ) {
    return { success: false, error: "A valid paste update payload is required." };
  }

  if (!payload.content.trim()) {
    return { success: false, error: "Paste content cannot be empty." };
  }

  return {
    success: true,
    data: {
      content: payload.content,
      mode: payload.mode as PasteMutationMode,
    },
  };
}
