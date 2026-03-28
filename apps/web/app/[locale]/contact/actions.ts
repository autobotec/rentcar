"use server"

import {
  processContactSubmission,
  validateContactPayload,
} from "../../../lib/contact"

export type SubmitContactResult =
  | { ok: true }
  | {
      ok: false
      errorKey:
        | "validationName"
        | "validationEmail"
        | "validationMessage"
        | "sendFailed"
    }

export async function submitContact(formData: FormData): Promise<SubmitContactResult> {
  const parsed = validateContactPayload({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  })

  if (!parsed.ok) {
    return { ok: false, errorKey: parsed.errorKey }
  }

  try {
    await processContactSubmission(parsed.data)
  } catch {
    return { ok: false, errorKey: "sendFailed" }
  }

  return { ok: true }
}
