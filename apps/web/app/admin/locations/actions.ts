"use server"

import { revalidatePath } from "next/cache"

async function getApiBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"
}

export async function createLocation(formData: FormData) {
  const parsed = parseLocationForm(formData)
  if (!parsed.ok || !parsed.payload) {
    return { ok: false as const, message: parsed.message }
  }

  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "No se pudo crear la ubicación."
    return { ok: false as const, message: String(msg) }
  }

  revalidatePath("/admin/locations")
  return { ok: true as const }
}

function parseLocationForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    return { ok: false as const, message: "El nombre es obligatorio.", payload: null }
  }

  const type = String(formData.get("type") ?? "branch").trim() || "branch"
  const code = String(formData.get("code") ?? "").trim()
  const region = String(formData.get("region") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()
  const country =
    String(formData.get("country") ?? "").trim() || "Dominican Republic"

  const latRaw = String(formData.get("latitude") ?? "").trim()
  const lngRaw = String(formData.get("longitude") ?? "").trim()
  const latitude = latRaw === "" ? null : Number(latRaw)
  const longitude = lngRaw === "" ? null : Number(lngRaw)
  if (latRaw !== "" && !Number.isFinite(latitude)) {
    return { ok: false as const, message: "Latitud no válida.", payload: null }
  }
  if (lngRaw !== "" && !Number.isFinite(longitude)) {
    return { ok: false as const, message: "Longitud no válida.", payload: null }
  }

  return {
    ok: true as const,
    message: "",
    payload: {
      name,
      type,
      code: code || null,
      region: region || null,
      address: address || null,
      country,
      latitude,
      longitude,
    },
  }
}

export async function updateLocation(id: string, formData: FormData) {
  const parsed = parseLocationForm(formData)
  if (!parsed.ok || !parsed.payload) {
    return { ok: false as const, message: parsed.message }
  }

  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/locations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "No se pudo actualizar la ubicación."
    return { ok: false as const, message: String(msg) }
  }

  revalidatePath("/admin/locations")
  return { ok: true as const }
}

export async function deleteLocation(id: string) {
  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/locations/${id}`, {
    method: "DELETE",
    cache: "no-store",
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "No se pudo eliminar la ubicación."
    return { ok: false as const, message: String(msg) }
  }

  revalidatePath("/admin/locations")
  return { ok: true as const }
}
