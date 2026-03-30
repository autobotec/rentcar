"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"

export function AdminReservationDetail({ reservationId, status }: { reservationId: string; status: string }) {
  const t = useTranslations("admin.reservationDetail")
  const router = useRouter()
  const canCheckIn = status === "pending" || status === "confirmed"
  const canCheckOut = status === "checked_in"

  const handleCheckIn = async () => {
    try {
      const res = await fetch(`${API}/reservations/${reservationId}/checkin`, { method: "POST" })
      if (res.ok) router.refresh()
    } catch (_) {}
  }

  const handleCheckOut = async () => {
    try {
      const res = await fetch(`${API}/reservations/${reservationId}/checkout`, { method: "POST" })
      if (res.ok) router.refresh()
    } catch (_) {}
  }

  return (
    <div className="flex flex-wrap gap-3 border-t pt-4">
      {canCheckIn && (
        <button
          type="button"
          onClick={handleCheckIn}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {t("checkIn")}
        </button>
      )}
      {canCheckOut && (
        <button
          type="button"
          onClick={handleCheckOut}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {t("checkOut")}
        </button>
      )}
    </div>
  )
}
