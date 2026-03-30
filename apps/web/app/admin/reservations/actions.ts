"use server"

async function getApiBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"
}

export async function getReservationsAdmin() {
  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/reservations`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function cancelReservationAdmin(id: string) {
  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/reservations/${id}/cancel`, {
    method: "POST",
    cache: "no-store",
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    // No lanzar error para evitar 500 en el admin; devolver mensaje para logging.
    console.warn("No se pudo cancelar la reserva:", data.message || res.statusText)
    return { ok: false, message: data.message || "No se pudo cancelar la reserva" }
  }
  const json = await res.json()
  return { ok: true, data: json }
}
