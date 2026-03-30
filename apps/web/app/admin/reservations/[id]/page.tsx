import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../../components/AdminPageHeading"
import { dateLocaleTag } from "../../../../lib/dateLocaleTag"
import { AdminReservationDetail } from "./AdminReservationDetail"

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"

async function getReservation(id: string) {
  const res = await fetch(`${API}/reservations/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export default async function AdminReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const reservation = await getReservation(id)
  const t = await getTranslations("admin.reservationDetail")
  const tList = await getTranslations("admin.reservations")
  const locale = await getLocale()
  const dateLoc = dateLocaleTag(locale)

  if (!reservation) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{t("notFound")}</p>
        <Link href="/admin/reservations" className="text-teal-600 hover:underline">
          {t("backList")}
        </Link>
      </div>
    )
  }

  function reservationStatus(s: string) {
    const map: Record<string, string> = {
      pending: tList("status_pending"),
      confirmed: tList("status_confirmed"),
      canceled: tList("status_canceled"),
      checked_in: tList("status_checked_in"),
      completed: tList("status_completed"),
    }
    return map[s] ?? s
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-3 text-right">
        <AdminPageHeading>
          {t("title", { number: reservation.reservationNumber })}
        </AdminPageHeading>
        <Link href="/admin/reservations" className="text-sm text-slate-600 hover:text-slate-900">
          {t("backReservations")}
        </Link>
      </div>
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <p>
          <span className="font-medium text-slate-600">{t("labelStatus")}</span>{" "}
          {reservationStatus(reservation.status)}
        </p>
        <p>
          <span className="font-medium text-slate-600">{t("labelPayment")}</span>{" "}
          {reservation.paymentStatus === "paid" ? t("paid") : t("paymentPending")}
        </p>
        <p>
          <span className="font-medium text-slate-600">{t("labelCustomer")}</span>{" "}
          {reservation.user?.name || reservation.user?.email}
        </p>
        <p>
          <span className="font-medium text-slate-600">{t("labelVehicle")}</span>{" "}
          {reservation.vehicle?.brand} {reservation.vehicle?.model}{" "}
          {reservation.vehicle?.year != null && `(${reservation.vehicle.year})`}
        </p>
        <p>
          <span className="font-medium text-slate-600">{t("labelPickup")}</span>{" "}
          {reservation.pickupLocation?.name} —{" "}
          {new Date(reservation.pickupDatetime).toLocaleString(dateLoc)}
        </p>
        <p>
          <span className="font-medium text-slate-600">{t("labelDropoff")}</span>{" "}
          {reservation.dropoffLocation?.name} —{" "}
          {new Date(reservation.dropoffDatetime).toLocaleString(dateLoc)}
        </p>
        <p>
          <span className="font-medium text-slate-600">{t("labelTotal")}</span>{" "}
          {reservation.currency} {reservation.totalPrice?.toFixed(0)}
        </p>
        <AdminReservationDetail reservationId={reservation.id} status={reservation.status} />
      </div>
    </div>
  )
}
