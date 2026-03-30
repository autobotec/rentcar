import { Link } from "../../../../navigation"
import { ContractActions } from "./ContractActions"

type Reservation = {
  id: string
  reservationNumber: string
  status: string
  totalPrice: number
  currency: string
  pickupDatetime: string
  dropoffDatetime: string
  vehicle: {
    brand: string
    model: string
    year: number | null
    description: string | null
  }
  user: { name: string | null; email: string }
  pickupLocation: { name: string }
  dropoffLocation: { name: string }
  extras?: { quantity: number; extra: { name: string } }[]
}

async function getReservation(id: string): Promise<Reservation | null> {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:4106/api"
  const res = await fetch(`${baseUrl}/reservations/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as Reservation
  } catch {
    return null
  }
}

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = await params
  const reservation = await getReservation(id)

  if (!reservation) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">Reserva no encontrada.</p>
        <Link href="/my-reservations" className="mt-4 inline-block text-teal-600 hover:underline">
          Buscar mi reserva
        </Link>
      </main>
    )
  }

  const pickupDate = new Date(reservation.pickupDatetime)
  const dropoffDate = new Date(reservation.dropoffDatetime)
  const nights = Math.max(1, Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <main className="min-h-screen bg-white p-6 md:p-10 print:p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold border-b pb-2 mb-6">Contrato de alquiler</h1>

        <div className="space-y-4 text-sm mb-8">
          <p><strong>Número de reserva:</strong> {reservation.reservationNumber}</p>
          <p><strong>Cliente:</strong> {reservation.user.name || reservation.user.email}</p>
          <p><strong>Email:</strong> {reservation.user.email}</p>
          <p><strong>Vehículo:</strong> {reservation.vehicle.brand} {reservation.vehicle.model}{reservation.vehicle.year != null && `, año ${reservation.vehicle.year}`}</p>
          <p><strong>Lugar y fecha de recogida:</strong> {reservation.pickupLocation.name} — {pickupDate.toLocaleString("es")}</p>
          <p><strong>Lugar y fecha de devolución:</strong> {reservation.dropoffLocation.name} — {dropoffDate.toLocaleString("es")}</p>
          <p><strong>Duración:</strong> {nights} día{nights !== 1 ? "s" : ""}</p>
          {reservation.extras?.length ? (
            <p><strong>Extras:</strong> {reservation.extras.map((e) => `${e.extra.name} (x${e.quantity})`).join(", ")}</p>
          ) : null}
          <p><strong>Importe total:</strong> {reservation.currency} {reservation.totalPrice.toFixed(2)}</p>
        </div>

        <div className="border-t pt-6 text-sm text-slate-700 space-y-3">
          <h2 className="font-semibold text-slate-900">Condiciones generales</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>El vehículo se entrega con el depósito de combustible según política de la empresa.</li>
            <li>El cliente devolverá el vehículo en el mismo estado, en la ubicación y fecha acordadas.</li>
            <li>Se requiere licencia de conducir vigente y documento de identidad.</li>
            <li>La edad mínima para conducir es 21 años.</li>
            <li>Cualquier daño o multa durante el periodo de alquiler será responsabilidad del cliente según los términos del seguro contratado.</li>
          </ul>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Documento generado el {new Date().toLocaleString("es")}. Este contrato es válido como comprobante de reserva.
        </p>

        <ContractActions reservationId={reservation.id} />
      </div>
    </main>
  )
}
