"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FloatingBrandLogoStandalone } from "../../components/FloatingBrandLogoStandalone"

export default function MyReservationsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [reservationNumber, setReservationNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:4106/api"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const params = new URLSearchParams({ email: email.trim(), reservationNumber: reservationNumber.trim().toUpperCase() })
      const res = await fetch(`${baseUrl}/reservations/lookup?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "No se encontró la reserva")
      router.push(`/reservation/${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al buscar la reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <FloatingBrandLogoStandalone />
      <section className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Mis reservas</h1>
        <p className="text-sm text-slate-600 mb-6">
          Introduce el correo con el que reservaste y el número de reserva para ver el detalle.
        </p>
        <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="tu@email.com" />
          </div>
          <div>
            <label htmlFor="reservationNumber" className="block text-sm font-medium text-slate-700 mb-1">Número de reserva</label>
            <input id="reservationNumber" type="text" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value.toUpperCase())} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono uppercase" placeholder="Ej. RES-XXXX" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60">
            {loading ? "Buscando..." : "Ver mi reserva"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          <Link href="/" className="text-teal-600 hover:underline">Volver al inicio</Link>
        </p>
      </section>
    </main>
  )
}
