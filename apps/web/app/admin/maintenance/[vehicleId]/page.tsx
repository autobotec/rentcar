import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../../components/AdminPageHeading"
import { getMaintenanceDashboard, getMaintenanceRecords } from "../actions"
import { MaintenanceVehicleClient } from "./MaintenanceVehicleClient"

export default async function AdminMaintenanceVehiclePage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const { vehicleId: raw } = await params
  const vehicleSlug = decodeURIComponent(raw)

  const [rows, records, tMaint, tDash] = await Promise.all([
    getMaintenanceDashboard(),
    getMaintenanceRecords(vehicleSlug),
    getTranslations("admin.maintenance"),
    getTranslations("admin.dashboard"),
  ])

  const row = rows.find((r) => r.vehicleId === vehicleSlug || r.publicCode === vehicleSlug)
  const vehicleLabel = row?.label ?? vehicleSlug

  if (!row && records.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{tMaint("vehicleNotFound")}</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/maintenance" className="text-teal-600 hover:underline">
            {tMaint("backSummary")}
          </Link>
          <Link href="/admin" className="text-teal-600 hover:underline">
            {tDash("backDashboard")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-2 text-right">
        <AdminPageHeading>{vehicleLabel}</AdminPageHeading>
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm">
          <Link href="/admin" className="text-slate-500 hover:text-slate-800">
            {tDash("backDashboard")}
          </Link>
          <Link href="/admin/maintenance" className="text-slate-500 hover:text-slate-800">
            {tMaint("backMaintenance")}
          </Link>
        </div>
      </div>
      <MaintenanceVehicleClient
        vehicleSlug={vehicleSlug}
        vehicleLabel={vehicleLabel}
        initialRecords={records}
      />
    </div>
  )
}
