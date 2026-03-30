"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { FloatingBrandLogoStandalone } from "../../../components/FloatingBrandLogoStandalone"

type Reservation = {
  id: string
  reservationNumber: string
  status: string
  paymentStatus?: string
  totalPrice: number
  currency: string
  pickupDatetime: string
  dropoffDatetime: string
  vehicle: { id: string; brand: string; model: string; year: number | null; location?: { name: string; code: string | null }; images?: { url: string }[] }
  user?: { name: string | null; email: string }
  pickupLocation?: { name: string; code: string | null }
  dropoffLocation?: { name: string; code: string | null }
  extras?: { quantity: number; extra: { name: string; pricePerDay: number | null } }[]
}

export default function ReservationDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:4106/api"
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canceling, setCanceling] = useState(false)
  const [startingPayment, setStartingPayment] = useState(false)
  const [provider, setProvider] = useState<"stripe" | "paypal">("stripe")

  useEffect(() => {
    if (!id) return
    fetch(`${baseUrl}/reservations/${id}`)
      .then((res) => res.json())
      .then((data) => { if (data.id) setReservation(data); else setError("Reserva no encontrada") })
      .catch(() => setError("Error al cargar la reserva"))
      .finally(() => setLoading(false))
  }, [id, baseUrl])

  const handleCancel = async () => {
    if (!id || !confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return
    setCanceling(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/reservations/${id}/cancel`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "No se pudo cancelar")
      setReservation((prev) => (prev ? { ...prev, status: "canceled" } : null))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cancelar")
    } finally {
      setCanceling(false)
    }
  }

  const handlePay = async () => {
    if (!id) return
    setStartingPayment(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/reservations/${id}/start-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "No se pudo iniciar el pago")
      const paymentId = data.paymentId
      if (paymentId) {
        window.location.href = `/reservation/${id}/payment?paymentId=${encodeURIComponent(paymentId)}`
        return
      }
      throw new Error("No se recibió el ID de pago")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar el pago")
    } finally {
      setStartingPayment(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-50">
        <FloatingBrandLogoStandalone />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-slate-600">Cargando reserva...</p>
        </div>
      </main>
    )
  }

  if (error && !reservation) {
    return (
      <main className="min-h-screen bg-slate-50">
        <FloatingBrandLogoStandalone />
        <section className="max-w-2xl mx-auto px-4 py-10 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/my-reservations" className="text-teal-600 hover:underline">Buscar otra reserva</Link>
        </section>
      </main>
    )
  }

  if (!reservation) return null

  const canCancel = reservation.status === "pending" || reservation.status === "confirmed"
  const needsPayment = (reservation.paymentStatus !== "paid" && reservation.status !== "canceled")
  const statusLabel: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", canceled: "Cancelada", checked_in: "En curso", completed: "Completada" }

  return (
    <main className="min-h-screen bg-slate-50">
      <FloatingBrandLogoStandalone />
      <section className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reserva {reservation.reservationNumber}</h1>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${reservation.status === "canceled" ? "bg-red-100 text-red-800" : reservation.status === "completed" ? "bg-slate-200 text-slate-700" : "bg-teal-100 text-teal-800"}`}>
            {statusLabel[reservation.status] ?? reservation.status}
          </span>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="rounded-lg border bg-white p-4 space-y-3 text-sm">
          <p><span className="font-medium text-slate-600">Vehículo:</span> {reservation.vehicle.brand} {reservation.vehicle.model}{reservation.vehicle.year != null && ` (${reservation.vehicle.year})`}</p>
          <p><span className="font-medium text-slate-600">Recogida:</span> {reservation.pickupLocation?.name ?? "—"} — {new Date(reservation.pickupDatetime).toLocaleString("es")}</p>
          <p><span className="font-medium text-slate-600">Devolución:</span> {reservation.dropoffLocation?.name ?? "—"} — {new Date(reservation.dropoffDatetime).toLocaleString("es")}</p>
          {reservation.extras?.length ? <p><span className="font-medium text-slate-600">Extras:</span> {reservation.extras.map((e) => `${e.extra.name} x${e.quantity}`).join(", ")}</p> : null}
          <p><span className="font-medium text-slate-600">Total:</span> {reservation.currency} {reservation.totalPrice.toFixed(0)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {needsPayment && (
            <>
              <div className="w-full">
                <div className="flex flex-wrap gap-3 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="provider"
                      value="stripe"
                      checked={provider === "stripe"}
                      onChange={() => setProvider("stripe")}
                      className="rounded border-slate-300"
                    />
                    <span>Tarjeta (Stripe)</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="provider"
                      value="paypal"
                      checked={provider === "paypal"}
                      onChange={() => setProvider("paypal")}
                      className="rounded border-slate-300"
                    />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePay}
                disabled={startingPayment}
                className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {startingPayment ? "Preparando pago..." : "Pagar ahora"}
              </button>
            </>
          )}
          <Link href={`/reservation/${reservation.id}/contract`} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Ver contrato</Link>
          {canCancel && (
            <button type="button" onClick={handleCancel} disabled={canceling} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {canceling ? "Cancelando..." : "Cancelar reserva"}
            </button>
          )}
          <Link href="/" className="rounded-md text-slate-600 text-sm hover:underline">Volver al inicio</Link>
        </div>
      </section>
    </main>
  )
}
