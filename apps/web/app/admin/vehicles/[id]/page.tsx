import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../../components/AdminPageHeading"
import { getLocations } from "../actions"
import { VehicleForm } from "../VehicleForm"

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"

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
  const t = await getTranslations("admin.vehicles")
  const [vehicle, locations] = await Promise.all([
    getVehicle(id),
    getLocations(),
  ])
  if (!vehicle) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{t("notFound")}</p>
        <Link href="/admin/vehicles" className="text-teal-600 hover:underline">
          {t("backList")}
        </Link>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-2 text-right">
        <AdminPageHeading>
          {t("editTitle", { brand: vehicle.brand, model: vehicle.model })}
        </AdminPageHeading>
        <Link
          href="/admin/vehicles"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          {t("backVehicles")}
        </Link>
      </div>
      <VehicleForm locations={locations} initialData={vehicle} />
    </div>
  )
}
