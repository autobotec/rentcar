"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { FloatingBrandLogoStandalone } from "../../../../components/FloatingBrandLogoStandalone"
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

declare global {
  interface Window {
    paypal?: any
  }
}

type PaymentDetails = {
  paymentId: string
  provider: "stripe" | "paypal" | "test" | string
  amount: number
  currency: string
  providerPaymentId: string
  clientSecret?: string
  orderId?: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

function StripePaymentForm({
  clientSecret,
  onConfirmed,
  confirming,
}: {
  clientSecret: string
  onConfirmed: () => Promise<void>
  confirming: boolean
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) return
    const card = elements.getElement(CardElement)
    if (!card) return

    setError(null)
    setProcessing(true)
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      })
      if (result.error) {
        setError(result.error.message || "Error al confirmar el pago")
        return
      }
      await onConfirmed()
    } catch (e: any) {
      setError(e?.message || "Error al confirmar el pago")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded border p-3 bg-white">
        <CardElement />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={processing || confirming || !stripe || !elements}
        className="w-full rounded-md bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {processing ? "Confirmando..." : "Pagar con tarjeta"}
      </button>
    </div>
  )
}

function PayPalPaymentForm({
  clientId,
  orderId,
  currency,
  onConfirmed,
}: {
  clientId: string
  orderId: string
  currency: string
  onConfirmed: () => Promise<void>
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const onConfirmedRef = useRef(onConfirmed)

  useEffect(() => {
    onConfirmedRef.current = onConfirmed
  }, [onConfirmed])

  useEffect(() => {
    if (!clientId || !orderId || !containerRef.current) return

    const loadScript = async () => {
      const existing = document.querySelector<HTMLScriptElement>(`script[data-paypal-client-id="${clientId}"]`)
      if (!existing) {
        const script = document.createElement("script")
        script.dataset.paypalClientId = clientId
        script.async = true
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(
          currency,
        )}&intent=capture&components=buttons`
        document.body.appendChild(script)
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("No se pudo cargar el SDK de PayPal"))
        })
      } else {
        if (!window.paypal) {
          await new Promise<void>((resolve) => {
            existing.addEventListener("load", () => resolve(), { once: true })
          })
        }
      }
    }

    const run = async () => {
      setError(null)
      await loadScript()
      if (!window.paypal) {
        setError("PayPal no está disponible")
        return
      }
      containerRef.current!.innerHTML = ""
      window.paypal
        .Buttons({
          createOrder: () => orderId,
          onApprove: async (_data: any, actions: any) => {
            setLoading(true)
            try {
              await actions.order.capture()
              await onConfirmedRef.current()
            } catch (e: any) {
              setError(e?.message || "Error al capturar el pago de PayPal")
            } finally {
              setLoading(false)
            }
          },
          onError: (e: any) => {
            setError(e?.message || "Error con PayPal")
          },
        })
        .render(containerRef.current)
    }

    run()
  }, [clientId, orderId, currency])

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div ref={containerRef} />
      {loading && <p className="text-sm text-slate-600">Procesando PayPal...</p>}
    </div>
  )
}

export default function ReservationPaymentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = params?.id as string
  const paymentId = searchParams?.get("paymentId")

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:4100/api"
  const [details, setDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(!!paymentId)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentId || !reservationId) {
      setLoading(false)
      setError("Falta el ID de pago o de reserva")
      return
    }
  }, [paymentId, reservationId])

  useEffect(() => {
    if (!paymentId || !reservationId) return
    setLoading(true)
    setError(null)
    fetch(`${baseUrl}/reservations/payments/${paymentId}`)
      .then((res) => res.json())
      .then((data: PaymentDetails) => {
        if (data?.paymentId) setDetails(data)
        else setError("Pago no encontrado")
      })
      .catch(() => setError("Error al cargar el pago"))
      .finally(() => setLoading(false))
  }, [paymentId, reservationId, baseUrl])

  const confirmPayment = async () => {
    if (!paymentId) return
    setConfirming(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/reservations/payments/${paymentId}/confirm`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "No se pudo confirmar el pago")
      router.push(`/reservation/${reservationId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al confirmar el pago")
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-50">
        <FloatingBrandLogoStandalone />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-slate-600">Cargando...</p>
        </div>
      </main>
    )
  }

  if (error && !details) {
    return (
      <main className="min-h-screen bg-slate-50">
        <FloatingBrandLogoStandalone />
        <section className="max-w-md mx-auto px-4 py-10 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href={reservationId ? `/reservation/${reservationId}` : "/my-reservations"} className="text-teal-600 hover:underline">
            Volver
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <FloatingBrandLogoStandalone />
      <section className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-xl font-bold mb-2">Completar pago</h1>
        <p className="text-sm text-slate-600 mb-6">
          Introduce los datos de pago para confirmar tu reserva.
        </p>
        <div className="rounded-lg border bg-white p-6 space-y-4">
          {details && (
            <p className="text-lg font-semibold">
              Total: {details.currency} {details.amount.toFixed(0)}
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {details?.provider === "stripe" && details.clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret: details.clientSecret }}>
              <StripePaymentForm clientSecret={details.clientSecret} onConfirmed={confirmPayment} confirming={confirming} />
            </Elements>
          ) : null}

          {details?.provider === "paypal" && details.orderId ? (
            <PayPalPaymentForm
              clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
              orderId={details.orderId}
              currency={details.currency}
              onConfirmed={confirmPayment}
            />
          ) : null}

          {details?.provider === "test" ? (
            <button
              type="button"
              onClick={confirmPayment}
              disabled={confirming}
              className="w-full rounded-md bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {confirming ? "Confirmando..." : "Confirmar pago"}
            </button>
          ) : null}
          <Link
            href={`/reservation/${reservationId}`}
            className="block text-center text-sm text-slate-600 hover:underline"
          >
            Volver a la reserva
          </Link>
        </div>
      </section>
    </main>
  )
}
