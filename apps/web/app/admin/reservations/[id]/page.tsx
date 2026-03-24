import Link from "next/link"
import { AdminReservationDetail } from "./AdminReservationDetail"

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4100/api"

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

  if (!reservation) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Reserva no encontrada.</p>
        <Link href="/admin/reservations" className="text-teal-600 hover:underline">
          Volver al listado
        </Link>
      </div>
    )
  }

  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    canceled: "Cancelada",
    checked_in: "En curso",
    completed: "Completada",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/reservations" className="text-sm text-slate-600 hover:text-slate-900">
          ← Reservas
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">
        Reserva {reservation.reservationNumber}
      </h1>
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <p><span className="font-medium text-slate-600">Estado:</span> {statusLabel[reservation.status] ?? reservation.status}</p>
        <p><span className="font-medium text-slate-600">Pago:</span> {reservation.paymentStatus === "paid" ? "Pagado" : "Pendiente"}</p>
        <p><span className="font-medium text-slate-600">Cliente:</span> {reservation.user?.name || reservation.user?.email}</p>
        <p><span className="font-medium text-slate-600">Vehículo:</span> {reservation.vehicle?.brand} {reservation.vehicle?.model} {reservation.vehicle?.year != null && `(${reservation.vehicle.year})`}</p>
        <p><span className="font-medium text-slate-600">Recogida:</span> {reservation.pickupLocation?.name} — {new Date(reservation.pickupDatetime).toLocaleString("es")}</p>
        <p><span className="font-medium text-slate-600">Devolución:</span> {reservation.dropoffLocation?.name} — {new Date(reservation.dropoffDatetime).toLocaleString("es")}</p>
        <p><span className="font-medium text-slate-600">Total:</span> {reservation.currency} {reservation.totalPrice?.toFixed(0)}</p>
        <AdminReservationDetail reservationId={reservation.id} status={reservation.status} />
      </div>
    </div>
  )
}
