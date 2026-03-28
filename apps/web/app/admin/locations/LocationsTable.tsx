"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { deleteLocation, updateLocation } from "./actions"
import { LOCATION_TYPES } from "./locationConstants"

export type LocationTableRow = {
  id: string
  name: string
  type: string
  code: string | null
  country: string
  region: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
}

export function LocationsTable({ locations }: { locations: LocationTableRow[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<LocationTableRow | null>(null)
  const [formMsg, setFormMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Región</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{loc.name}</td>
                <td className="px-4 py-3 capitalize">{loc.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{loc.code ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{loc.region ?? "—"}</td>
                <td
                  className="max-w-xs truncate px-4 py-3 text-slate-600"
                  title={loc.address ?? undefined}
                >
                  {loc.address ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMsg(null)
                      setEditing(loc)
                    }}
                    className="text-teal-700 hover:underline"
                  >
                    Editar
                  </button>
                  <span className="mx-2 text-slate-300">|</span>
                  <button
                    type="button"
                    disabled={deletingId === loc.id}
                    onClick={() => {
                      if (
                        !window.confirm(
                          "¿Desactivar esta ubicación? Dejará de mostrarse en el sitio y en los listados (los datos se conservan en la base).",
                        )
                      ) {
                        return
                      }
                      setDeletingId(loc.id)
                      startTransition(async () => {
                        const r = await deleteLocation(loc.id)
                        setDeletingId(null)
                        if (!r.ok) {
                          window.alert(r.message)
                          return
                        }
                        router.refresh()
                      })
                    }}
                    className="text-red-700 hover:underline disabled:opacity-50"
                  >
                    {deletingId === loc.id ? "…" : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-loc-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null)
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 id="edit-loc-title" className="text-lg font-semibold text-slate-900">
              Editar ubicación
            </h2>
            <p className="mt-1 text-xs text-slate-600">ID: {editing.id}</p>

            {formMsg && (
              <p
                className={`mt-4 rounded-lg px-3 py-2 text-sm ${
                  formMsg.type === "ok"
                    ? "bg-teal-50 text-teal-900"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {formMsg.text}
              </p>
            )}

            <form
              className="mt-4 grid gap-4 sm:grid-cols-2"
              key={editing.id}
              onSubmit={(e) => {
                e.preventDefault()
                setFormMsg(null)
                const fd = new FormData(e.currentTarget)
                startTransition(async () => {
                  const r = await updateLocation(editing.id, fd)
                  if (r.ok) {
                    setFormMsg({ type: "ok", text: "Cambios guardados." })
                    router.refresh()
                    setTimeout(() => setEditing(null), 600)
                  } else {
                    setFormMsg({ type: "err", text: r.message })
                  }
                })
              }}
            >
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editing.name}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Tipo</label>
                <select
                  name="type"
                  defaultValue={editing.type}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {!LOCATION_TYPES.some((t) => t.value === editing.type) ? (
                    <option value={editing.type}>{editing.type}</option>
                  ) : null}
                  {LOCATION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Código</label>
                <input
                  name="code"
                  defaultValue={editing.code ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
                  maxLength={16}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Región</label>
                <input
                  name="region"
                  defaultValue={editing.region ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">País</label>
                <input
                  name="country"
                  defaultValue={editing.country}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Dirección</label>
                <input
                  name="address"
                  defaultValue={editing.address ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Latitud</label>
                <input
                  name="latitude"
                  type="text"
                  inputMode="decimal"
                  defaultValue={
                    editing.latitude != null ? String(editing.latitude) : ""
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Longitud</label>
                <input
                  name="longitude"
                  type="text"
                  inputMode="decimal"
                  defaultValue={
                    editing.longitude != null ? String(editing.longitude) : ""
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {pending ? "Guardando…" : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
