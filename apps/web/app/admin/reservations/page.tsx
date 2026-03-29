import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../components/AdminPageHeading"
import { dateLocaleTag } from "../../../lib/dateLocaleTag"
import { getReservationsAdmin, cancelReservationAdmin } from "./actions"

export default async function AdminReservationsPage() {
  const reservations = await getReservationsAdmin()
  const t = await getTranslations("admin.reservations")
  const locale = await getLocale()
  const dateLoc = dateLocaleTag(locale)

  function reservationStatus(s: string) {
    const map: Record<string, string> = {
      pending: t("status_pending"),
      confirmed: t("status_confirmed"),
      canceled: t("status_canceled"),
      checked_in: t("status_checked_in"),
      completed: t("status_completed"),
    }
    return map[s] ?? s
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-2 text-right">
        <AdminPageHeading>{t("title")}</AdminPageHeading>
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
          {t("backDashboard")}
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colNumber")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colCustomer")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colVehicle")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                {t("colDates")}
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
            {!reservations?.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  {t("empty")}
                </td>
              </tr>
            ) : (
              reservations.map((r: Record<string, unknown>) => (
                <tr key={String(r.id)} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-sm">{String(r.reservationNumber)}</td>
                  <td className="px-4 py-3 text-sm">
                    {(r.user as { name?: string; email?: string })?.name ||
                      (r.user as { email?: string })?.email ||
                      "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {(r.vehicle as { brand?: string; model?: string })?.brand
                      ? `${(r.vehicle as { brand: string }).brand} ${(r.vehicle as { model: string }).model}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {r.pickupDatetime
                      ? new Date(r.pickupDatetime as string).toLocaleDateString(dateLoc)
                      : "—"}{" "}
                    →{" "}
                    {r.dropoffDatetime
                      ? new Date(r.dropoffDatetime as string).toLocaleDateString(dateLoc)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                      {reservationStatus(String(r.status))}
                    </span>
                    <span className="ml-1 text-xs text-slate-500">
                      {r.paymentStatus === "paid" ? t("paymentPaid") : t("paymentPending")}
                    </span>
                  </td>
                  <td className="space-x-3 px-4 py-3 text-right">
                    <Link
                      href={`/admin/reservations/${r.id}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-800"
                    >
                      {t("view")}
                    </Link>
                    {r.paymentStatus !== "paid" &&
                      (r.status === "pending" || r.status === "confirmed") && (
                        <form
                          action={async () => {
                            "use server"
                            await cancelReservationAdmin(String(r.id))
                          }}
                        >
                          <button
                            type="submit"
                            className="text-sm font-medium text-rose-600 hover:text-rose-800"
                          >
                            {t("cancel")}
                          </button>
                        </form>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
