import Link from "next/link"
import { getLocations } from "../actions"
import { VehicleForm } from "../VehicleForm"

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4100/api"

async function getVehicle(id: string) {
  const res = await fetch(`${API}/vehicles/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [vehicle, locations] = await Promise.all([
    getVehicle(id),
    getLocations(),
  ])
  if (!vehicle) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Vehículo no encontrado.</p>
        <Link href="/admin/vehicles" className="text-teal-600 hover:underline">
          Volver a la lista
        </Link>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vehicles"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Vehículos
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Editar: {vehicle.brand} {vehicle.model}
        </h1>
      </div>
      <VehicleForm locations={locations} initialData={vehicle} />
    </div>
  )
}
