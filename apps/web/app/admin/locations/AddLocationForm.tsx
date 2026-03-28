"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { createLocation } from "./actions"
import { LOCATION_TYPES } from "./locationConstants"

export function AddLocationForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  return (
    <form
      className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        setMessage(null)
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          const r = await createLocation(fd)
          if (r.ok) {
            setMessage({ type: "ok", text: "Ubicación creada correctamente." })
            e.currentTarget.reset()
            router.refresh()
          } else {
            setMessage({ type: "err", text: r.message })
          }
        })
      }}
    >
      <h2 className="text-lg font-semibold text-slate-900">Nueva ubicación</h2>
      <p className="mt-1 text-xs text-slate-600">
        El código (p. ej. PUJ, SDQ) debe ser único si lo indicas.
      </p>

      {message && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            message.type === "ok"
              ? "bg-teal-50 text-teal-900"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="loc-name" className="block text-xs font-medium text-slate-700">
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            id="loc-name"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Ej: Punta Cana Airport"
          />
        </div>

        <div>
          <label htmlFor="loc-type" className="block text-xs font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="loc-type"
            name="type"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue="branch"
          >
            {LOCATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="loc-code" className="block text-xs font-medium text-slate-700">
            Código (IATA / interno)
          </label>
          <input
            id="loc-code"
            name="code"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
            placeholder="PUJ"
            maxLength={16}
          />
        </div>

        <div>
          <label htmlFor="loc-region" className="block text-xs font-medium text-slate-700">
            Región / provincia
          </label>
          <input
            id="loc-region"
            name="region"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="La Altagracia"
          />
        </div>

        <div>
          <label htmlFor="loc-country" className="block text-xs font-medium text-slate-700">
            País
          </label>
          <input
            id="loc-country"
            name="country"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue="Dominican Republic"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="loc-address" className="block text-xs font-medium text-slate-700">
            Dirección
          </label>
          <input
            id="loc-address"
            name="address"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Opcional"
          />
        </div>

        <div>
          <label htmlFor="loc-lat" className="block text-xs font-medium text-slate-700">
            Latitud
          </label>
          <input
            id="loc-lat"
            name="latitude"
            type="text"
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Opcional"
          />
        </div>

        <div>
          <label htmlFor="loc-lng" className="block text-xs font-medium text-slate-700">
            Longitud
          </label>
          <input
            id="loc-lng"
            name="longitude"
            type="text"
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Añadir ubicación"}
        </button>
      </div>
    </form>
  )
}
