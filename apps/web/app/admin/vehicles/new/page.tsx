import Link from "next/link"
import { getLocations } from "../actions"
import { VehicleForm } from "../VehicleForm"

export default async function NewVehiclePage() {
  const locations = await getLocations()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vehicles"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Vehículos
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo vehículo</h1>
      </div>
      <VehicleForm locations={locations} initialData={null} />
    </div>
  )
}
