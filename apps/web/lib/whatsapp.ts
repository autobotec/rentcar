/**
 * Número WhatsApp para enlaces wa.me.
 * Orden: WHATSAPP_PHONE (servidor, recomendado en apps/web/.env) o NEXT_PUBLIC_WHATSAPP_PHONE.
 */
export function getWhatsAppDigits(): string | null {
  const raw =
    process.env.WHATSAPP_PHONE?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.trim()
  if (!raw) return null
  const digits = raw.replace(/\D/g, "")
  return digits.length > 0 ? digits : null
}

export function getWhatsAppHref(): string | null {
  const digits = getWhatsAppDigits()
  return digits ? `https://wa.me/${digits}` : null
}
