"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { deleteLocation, updateLocation } from "./actions"
import { LOCATION_TYPE_VALUES } from "./locationConstants"

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

function isKnownType(t: string): t is (typeof LOCATION_TYPE_VALUES)[number] {
  return (LOCATION_TYPE_VALUES as readonly string[]).includes(t)
}

export function LocationsTable({ locations }: { locations: LocationTableRow[] }) {
  const tl = useTranslations("admin.locations")
  const router = useRouter()
  const [editing, setEditing] = useState<LocationTableRow | null>(null)
  const [formMsg, setFormMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const typeLabel = (type: string) =>
    isKnownType(type) ? tl(`type_${type}` as "type_airport") : type

  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">{tl("colName")}</th>
              <th className="px-4 py-3">{tl("colType")}</th>
              <th className="px-4 py-3">{tl("colCode")}</th>
              <th className="px-4 py-3">{tl("colRegion")}</th>
              <th className="px-4 py-3">{tl("colAddress")}</th>
              <th className="px-4 py-3 text-right">{tl("colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{loc.name}</td>
                <td className="px-4 py-3">{typeLabel(loc.type)}</td>
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
                    {tl("edit")}
                  </button>
                  <span className="mx-2 text-slate-300">|</span>
                  <button
                    type="button"
                    disabled={deletingId === loc.id}
                    onClick={() => {
                      if (!window.confirm(tl("confirmDelete"))) {
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
                    {deletingId === loc.id ? tl("deleting") : tl("delete")}
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
              {tl("editTitle")}
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {tl("idLabel")} {editing.id}
            </p>

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
                    setFormMsg({ type: "ok", text: tl("savedOk") })
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
                  {tl("name")} <span className="text-red-600">{tl("required")}</span>
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editing.name}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">{tl("type")}</label>
                <select
                  name="type"
                  defaultValue={editing.type}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {!isKnownType(editing.type) ? (
                    <option value={editing.type}>{editing.type}</option>
                  ) : null}
                  {LOCATION_TYPE_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {tl(`type_${v}` as "type_airport")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">{tl("colCode")}</label>
                <input
                  name="code"
                  defaultValue={editing.code ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
                  maxLength={16}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">{tl("colRegion")}</label>
                <input
                  name="region"
                  defaultValue={editing.region ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">{tl("country")}</label>
                <input
                  name="country"
                  defaultValue={editing.country}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">{tl("colAddress")}</label>
                <input
                  name="address"
                  defaultValue={editing.address ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">{tl("latitude")}</label>
                <input
                  name="latitude"
                  type="text"
                  inputMode="decimal"
                  defaultValue={editing.latitude != null ? String(editing.latitude) : ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">{tl("longitude")}</label>
                <input
                  name="longitude"
                  type="text"
                  inputMode="decimal"
                  defaultValue={editing.longitude != null ? String(editing.longitude) : ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {pending ? tl("saving") : tl("saveChanges")}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {tl("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
