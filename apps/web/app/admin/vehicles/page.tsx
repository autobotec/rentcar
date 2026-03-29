import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../components/AdminPageHeading"
import { getVehiclesAdmin } from "./actions"

export default async function AdminVehiclesPage() {
  const vehicles = await getVehiclesAdmin()
  const t = await getTranslations("admin.vehicles")

  function statusLabel(status: string) {
    if (status === "available") return t("statusAvailable")
    if (status === "reserved") return t("statusReserved")
    if (status === "maintenance") return t("statusMaintenance")
    return status
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full min-w-0 flex-col items-end gap-2 text-right">
          <AdminPageHeading>{t("title")}</AdminPageHeading>
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
            {t("backDashboard")}
          </Link>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="shrink-0 self-end rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 sm:self-start"
        >
          {t("newVehicle")}
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colVehicle")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colLocation")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colPriceDay")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colStatus")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">
                {t("colActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  {t("empty")}
                </td>
              </tr>
            ) : (
              vehicles.map(
                (v: {
                  id: string
                  publicCode?: string | null
                  brand: string
                  model: string
                  year?: number | null
                  location?: { name: string } | null
                  basePricePerDay: number
                  currency: string
                  status: string
                }) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">
                        {v.brand} {v.model}
                      </span>
                      {v.year && <span className="ml-1 text-slate-500">({v.year})</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {v.location?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {v.currency} {v.basePricePerDay.toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          v.status === "available"
                            ? "bg-teal-100 text-teal-800"
                            : v.status === "reserved"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {statusLabel(v.status)}
                      </span>
                    </td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <Link
                        href={`/admin/maintenance/${encodeURIComponent(v.publicCode || v.id)}`}
                        className="text-sm font-medium text-violet-600 hover:text-violet-800"
                      >
                        {t("history")}
                      </Link>
                      <Link
                        href={`/admin/vehicles/${encodeURIComponent(v.publicCode || v.id)}`}
                        className="text-sm font-medium text-teal-600 hover:text-teal-800"
                      >
                        {t("edit")}
                      </Link>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
