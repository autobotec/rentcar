import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../components/AdminPageHeading"
import { dateLocaleTag } from "../../../lib/dateLocaleTag"
import { getMaintenanceDashboard } from "./actions"

function formatTotals(totals: Record<string, number>, dash: string) {
  const entries = Object.entries(totals).filter(([, v]) => v > 0)
  if (entries.length === 0) return dash
  return entries.map(([c, a]) => `${c} ${a.toFixed(2)}`).join(" · ")
}

export default async function AdminMaintenanceDashboardPage() {
  const rows = await getMaintenanceDashboard()
  const t = await getTranslations("admin.maintenance")
  const tDash = await getTranslations("admin.dashboard")
  const locale = await getLocale()
  const dateLoc = dateLocaleTag(locale)

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-2 text-right">
        <AdminPageHeading>{t("title")}</AdminPageHeading>
        <p className="text-sm text-slate-600">{t("intro")}</p>
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800">
          {tDash("backDashboard")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colVehicle")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colRecords")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colLastKm")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colTotalSpend")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colLastMove")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">
                {t("colActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  {t("emptyTable")}
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const slug = encodeURIComponent(r.publicCode || r.vehicleId)
                const catKey = r.lastCategory
                  ? (`category_${r.lastCategory}` as const)
                  : null
                const lastCat = catKey ? t(catKey as "category_oil_change") : ""
                const lastInfo =
                  r.lastPerformedAt && r.lastCategory
                    ? `${new Date(r.lastPerformedAt).toLocaleDateString(dateLoc)} · ${lastCat}`
                    : t("dash")
                return (
                  <tr key={r.vehicleId} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{r.label}</span>
                      {r.publicCode && (
                        <span className="ml-2 font-mono text-xs text-slate-500">{r.publicCode}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{r.recordCount}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.lastMileageKm != null
                        ? `${r.lastMileageKm.toLocaleString(dateLoc)} km`
                        : t("dash")}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatTotals(r.totalsByCurrency, t("dash"))}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lastInfo}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/maintenance/${slug}`}
                        className="font-medium text-teal-600 hover:text-teal-800"
                      >
                        {t("viewHistory")}
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
