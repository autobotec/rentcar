export type ContactPayload = {
  name: string
  email: string
  phone: string
  message: string
}

export function validateContactPayload(
  p: Partial<ContactPayload>,
):
  | { ok: true; data: ContactPayload }
  | { ok: false; errorKey: "validationName" | "validationEmail" | "validationMessage" } {
  const name = p.name?.trim() ?? ""
  const email = p.email?.trim() ?? ""
  const phone = p.phone?.trim() ?? ""
  const message = p.message?.trim() ?? ""
  if (!name) return { ok: false, errorKey: "validationName" }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, errorKey: "validationEmail" }
  }
  if (!message) return { ok: false, errorKey: "validationMessage" }
  return { ok: true, data: { name, email, phone, message } }
}

export async function processContactSubmission(data: ContactPayload): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log("[contact]", data)
  }
}
