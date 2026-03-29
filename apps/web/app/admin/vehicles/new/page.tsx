import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../../components/AdminPageHeading"
import { getLocations } from "../actions"
import { VehicleForm } from "../VehicleForm"

export default async function NewVehiclePage() {
  const locations = await getLocations()
  const t = await getTranslations("admin.vehicles")
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-2 text-right">
        <AdminPageHeading>{t("newTitle")}</AdminPageHeading>
        <Link
          href="/admin/vehicles"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          {t("backVehicles")}
        </Link>
      </div>
      <VehicleForm locations={locations} initialData={null} />
    </div>
  )
}
