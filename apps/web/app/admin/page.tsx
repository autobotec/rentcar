import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../components/AdminPageHeading"

export default async function AdminPage() {
  const t = await getTranslations("admin.dashboard")
  return (
    <div className="space-y-6">
      <AdminPageHeading>{t("title")}</AdminPageHeading>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/vehicles"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-800">{t("vehiclesTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("vehiclesDesc")}</p>
        </Link>
        <Link
          href="/admin/reservations"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-800">{t("reservationsTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("reservationsDesc")}</p>
        </Link>
        <Link
          href="/admin/maintenance"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md md:col-span-2 lg:col-span-1"
        >
          <h2 className="text-lg font-semibold text-slate-800">{t("maintenanceTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("maintenanceDesc")}</p>
        </Link>
      </div>
    </div>
  )
}
