"use server"

async function getApiBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4100/api"
}

export type MaintenanceDashboardRow = {
  vehicleId: string
  publicCode: string | null
  label: string
  recordCount: number
  lastMileageKm: number | null
  totalsByCurrency: Record<string, number>
  lastPerformedAt: string | null
  lastCategory: string | null
}

export async function getMaintenanceDashboard(): Promise<MaintenanceDashboardRow[]> {
  const base = await getApiBaseUrl()
  const res = await fetch(`${base}/vehicle-maintenance/dashboard`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export type MaintenanceRecord = {
  id: string
  vehicleId: string
  performedAt: string
  mileageKm: number | null
  category: string
  title: string | null
  description: string | null
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

export async function getMaintenanceRecords(vehicleSlug: string): Promise<MaintenanceRecord[]> {
  const base = await getApiBaseUrl()
  const path = encodeURIComponent(vehicleSlug)
  const res = await fetch(`${base}/vehicle-maintenance/vehicle/${path}`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}
