import Link from "next/link"
import { getVehiclesAdmin } from "./actions"

export default async function AdminVehiclesPage() {
  const vehicles = await getVehiclesAdmin()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Vehículos</h1>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Nuevo vehículo
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                Vehículo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                Ubicación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                Precio/día
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay vehículos. Crea uno desde &quot;Nuevo vehículo&quot;.
                </td>
              </tr>
            ) : (
              vehicles.map((v: { id: string; publicCode?: string | null; brand: string; model: string; year?: number | null; location?: { name: string } | null; basePricePerDay: number; currency: string; status: string }) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">
                      {v.brand} {v.model}
                    </span>
                    {v.year && (
                      <span className="ml-1 text-slate-500">({v.year})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {v.location?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {v.currency} {v.basePricePerDay.toFixed(0)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        v.status === "available"
                          ? "bg-teal-100 text-teal-800"
                          : v.status === "reserved"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/vehicles/${encodeURIComponent(v.publicCode || v.id)}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-800"
                    >
                      Editar
                    </Link>
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
