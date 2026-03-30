"use server"

async function getApiBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"
}

export async function getVehiclesAdmin() {
  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/vehicles?status=all`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function getLocations() {
  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/locations`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}
