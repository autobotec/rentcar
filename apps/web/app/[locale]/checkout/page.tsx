"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLocale } from "next-intl"

function PayNowButton({
  reservationId,
  locale,
  provider,
}: {
  reservationId: string
  locale: string
  provider: "stripe" | "paypal"
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:4100/api"
  const [loading, setLoading] = useState(false)
  const handlePay = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/reservations/${reservationId}/start-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })
      const data = await res.json()
      if (res.ok && data.paymentId) {
        window.location.href = `/${locale}/reservation/${reservationId}/payment?paymentId=${encodeURIComponent(data.paymentId)}`
        return
      }
    } catch (_) {}
    setLoading(false)
  }
  return (
    <button type="button" onClick={handlePay} disabled={loading} className="rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 disabled:opacity-60">
      {loading ? "Preparando..." : "Pagar ahora"}
    </button>
  )
}

type Extra = {
  id: string
  name: string
  description: string | null
  pricePerDay: number | null
  priceType: string
  currency: string
}

type QuoteResponse = {
  vehicleId: string
  nights: number
  currency: string
  subtotal: number
  extrasBreakdown?: { extraId: string; name: string; quantity: number; price: number }[]
  extrasTotal?: number
  totalPrice: number
}

type ReservationResponse = {
  id: string
  reservationNumber: string
  status: string
  totalPrice: number
  currency: string
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()

  const vehicleId = searchParams.get("vehicleId")
  const pickup = searchParams.get("pickup")
  const dropoff = searchParams.get("dropoff")

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:4100/api"
  const [extras, setExtras] = useState<Extra[]>([])
  const [selectedExtras, setSelectedExtras] = useState<{ extraId: string; quantity: number }[]>([])
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<ReservationResponse | null>(null)
  const [provider, setProvider] = useState<"stripe" | "paypal">("stripe")

  useEffect(() => {
    fetch(`${baseUrl}/extras`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setExtras(data))
      .catch(() => {})
  }, [baseUrl])

  useEffect(() => {
    if (!vehicleId || !pickup || !dropoff) return
    const extrasBody = selectedExtras.filter((e) => e.quantity > 0).map((e) => ({ extraId: e.extraId, quantity: e.quantity }))
    const fetchQuote = async () => {
      try {
        setLoadingQuote(true)
        setError(null)
        const res = await fetch(`${baseUrl}/reservations/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId,
            pickupDatetime: new Date(pickup).toISOString(),
            dropoffDatetime: new Date(dropoff).toISOString(),
            ...(extrasBody.length ? { extras: extrasBody } : {}),
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "No se pudo calcular la tarifa")
        setQuote(data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al obtener la cotización")
      } finally {
        setLoadingQuote(false)
      }
    }
    fetchQuote()
  }, [vehicleId, pickup, dropoff, baseUrl, selectedExtras])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!vehicleId || !pickup || !dropoff) return
    const formData = new FormData(e.currentTarget)
    const customerName = String(formData.get("name") || "")
    const customerEmail = String(formData.get("email") || "")
    const extrasBody = selectedExtras.filter((e) => e.quantity > 0).map((e) => ({ extraId: e.extraId, quantity: e.quantity }))
    try {
      setSubmitting(true)
      setError(null)
      const res = await fetch(`${baseUrl}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          pickupDatetime: new Date(pickup).toISOString(),
          dropoffDatetime: new Date(dropoff).toISOString(),
          customerName,
          customerEmail,
          ...(extrasBody.length ? { extras: extrasBody } : {}),
        }),
      })
      const data: ReservationResponse | { message?: string } = await res.json()
      if (!res.ok) throw new Error((data as { message?: string }).message || "No se pudo crear la reserva")
      const created = data as ReservationResponse
      setSuccess(created)

      // Iniciar inmediatamente el pago del primer día (flujo test).
      const payRes = await fetch(`${baseUrl}/reservations/${created.id}/start-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })
      const payData = await payRes.json()
      if (payRes.ok && payData.paymentId) {
        window.location.href = `/${locale}/reservation/${created.id}/payment?paymentId=${encodeURIComponent(
          payData.paymentId,
        )}`
        return
      }

      setError("Reserva creada, pero no se pudo iniciar el pago. Intenta nuevamente más tarde.")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear la reserva")
    } finally {
      setSubmitting(false)
    }
  }

  if (!vehicleId || !pickup || !dropoff) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-2">Faltan datos de la reserva.</p>
          <button
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            onClick={() => router.push(`/${locale}`)}
          >
            Volver al inicio
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Confirmar reserva</h1>
          <p className="text-sm text-slate-600">
            Revisa los datos y completa tu información para confirmar la reserva. Se cobrará el valor del primer día.
          </p>
        </header>

        <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
          <p><span className="font-medium">Vehículo:</span> {vehicleId}</p>
          <p><span className="font-medium">Recogida:</span> {pickup}</p>
          <p><span className="font-medium">Devolución:</span> {dropoff}</p>
          {loadingQuote ? (
            <p className="text-slate-500">Calculando tarifa...</p>
          ) : quote ? (
            <div className="space-y-1">
              <p>
                <span className="font-medium">Subtotal alquiler:</span> {quote.currency} {(quote.subtotal ?? quote.totalPrice).toFixed(0)} ({quote.nights} noche{quote.nights > 1 ? "s" : ""})
              </p>
              {quote.extrasBreakdown?.length ? (
                <>
                  {quote.extrasBreakdown.map((x) => (
                    <p key={x.extraId}>{x.name} x{x.quantity}: {quote.currency} {x.price.toFixed(0)}</p>
                  ))}
                  <p><span className="font-medium">Extras:</span> {quote.currency} {(quote.extrasTotal ?? 0).toFixed(0)}</p>
                </>
              ) : null}
              <p><span className="font-medium">Total estimado:</span> {quote.currency} {quote.totalPrice.toFixed(0)}</p>
            </div>
          ) : null}
        </section>

        {extras.length > 0 && !success && (
          <section className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Extras opcionales</h2>
            <ul className="space-y-2">
              {extras.map((extra) => {
                const sel = selectedExtras.find((e) => e.extraId === extra.id)
                const qty = sel?.quantity ?? 0
                return (
                  <li key={extra.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={qty > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExtras((prev) => [...prev.filter((x) => x.extraId !== extra.id), { extraId: extra.id, quantity: 1 }])
                        } else {
                          setSelectedExtras((prev) => prev.filter((x) => x.extraId !== extra.id))
                        }
                      }}
                      className="rounded border-slate-300"
                    />
                    <span className="flex-1 text-sm">{extra.name}</span>
                    <span className="text-sm text-slate-600">
                      {extra.currency} {(extra.pricePerDay ?? 0).toFixed(0)}/{extra.priceType === "fixed" ? "reserva" : "día"}
                    </span>
                    {qty > 0 && (
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={qty}
                        onChange={(e) => {
                          const v = Math.min(10, Math.max(0, parseInt(e.target.value, 10) || 0))
                          setSelectedExtras((prev) => [...prev.filter((x) => x.extraId !== extra.id), ...(v ? [{ extraId: extra.id, quantity: v }] : [])])
                        }}
                        className="w-14 rounded border px-2 py-1 text-sm"
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {success ? (
          <section className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm">
            <h2 className="text-lg font-semibold text-teal-800 mb-2">¡Reserva creada correctamente!</h2>
            <p>Número de reserva: <span className="font-mono font-bold text-green-900">{success.reservationNumber}</span></p>
            <p>Importe: {success.currency} {success.totalPrice.toFixed(0)}</p>
            <p className="mt-2 text-xs text-slate-600">
              En una fase posterior, aquí se integrará el pago online y el envío de email/WhatsApp.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href={`/${locale}/reservation/${success.id}`} className="inline-block rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                Ver mi reserva
              </a>
              <PayNowButton reservationId={success.id} locale={locale} provider={provider} />
            </div>
          </section>
        ) : (
          <section className="rounded-lg border bg-white p-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Nombre completo</label>
                  <input id="name" name="name" required className="mt-1 rounded-md border px-3 py-2 text-sm" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Correo electrónico</label>
                  <input id="email" name="email" type="email" required className="mt-1 rounded-md border px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">Método de pago</span>
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Procesando..." : "Confirmar y pagar primer día"}
              </button>
            </form>
          </section>
        )}
      </section>
    </main>
  )
}

function CheckoutLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-600">Cargando checkout…</p>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
