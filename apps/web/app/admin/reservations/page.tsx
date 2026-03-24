import Link from "next/link"
import { getReservationsAdmin, cancelReservationAdmin } from "./actions"

export default async function AdminReservationsPage() {
  const reservations = await getReservationsAdmin()
  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    canceled: "Cancelada",
    checked_in: "En curso",
    completed: "Completada",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Reservas</h1>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nº</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Vehículo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fechas</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {!reservations?.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No hay reservas.</td>
              </tr>
            ) : (
              reservations.map((r: Record<string, unknown>) => (
                <tr key={String(r.id)} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-sm">{String(r.reservationNumber)}</td>
                  <td className="px-4 py-3 text-sm">{(r.user as { name?: string; email?: string })?.name || (r.user as { email?: string })?.email || "—"}</td>
                  <td className="px-4 py-3 text-sm">{(r.vehicle as { brand?: string; model?: string; year?: number }) ? `${(r.vehicle as { brand: string }).brand} ${(r.vehicle as { model: string }).model}` : "—"}</td>
                  <td className="px-4 py-3 text-sm">{r.pickupDatetime ? new Date(r.pickupDatetime as string).toLocaleDateString("es") : "—"} → {r.dropoffDatetime ? new Date(r.dropoffDatetime as string).toLocaleDateString("es") : "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
                      {statusLabel[String(r.status)] ?? String(r.status)}
                    </span>
                    <span className="ml-1 text-xs text-slate-500">
                      {r.paymentStatus === "paid" ? "Pagado" : "Pend. pago"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/reservations/${r.id}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-800"
                    >
                      Ver
                    </Link>
                    {r.paymentStatus !== "paid" && (r.status === "pending" || r.status === "confirmed") && (
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
                          Cancelar
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
