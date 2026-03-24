import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/vehicles"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-800">Vehículos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gestionar flota: fotos, características y precios de alquiler.
          </p>
        </Link>
        <Link
          href="/admin/reservations"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-800">Reservas</h2>
          <p className="mt-1 text-sm text-slate-500">
            Listado de reservas, check-in y check-out.
          </p>
        </Link>
      </div>
    </div>
  )
}
