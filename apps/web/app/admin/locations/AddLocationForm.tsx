"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { createLocation } from "./actions"
import { LOCATION_TYPE_VALUES } from "./locationConstants"

export function AddLocationForm() {
  const tl = useTranslations("admin.locations")
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
            setMessage({ type: "ok", text: tl("createdOk") })
            e.currentTarget.reset()
            router.refresh()
          } else {
            setMessage({ type: "err", text: r.message })
          }
        })
      }}
    >
      <h2 className="text-lg font-semibold text-slate-900">{tl("newTitle")}</h2>
      <p className="mt-1 text-xs text-slate-600">{tl("newHint")}</p>

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
            {tl("name")} <span className="text-red-600">{tl("required")}</span>
          </label>
          <input
            id="loc-name"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="loc-type" className="block text-xs font-medium text-slate-700">
            {tl("type")}
          </label>
          <select
            id="loc-type"
            name="type"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue="branch"
          >
            {LOCATION_TYPE_VALUES.map((v) => (
              <option key={v} value={v}>
                {tl(`type_${v}` as "type_airport")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="loc-code" className="block text-xs font-medium text-slate-700">
            {tl("code")}
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
            {tl("region")}
          </label>
          <input id="loc-region" name="region" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label htmlFor="loc-country" className="block text-xs font-medium text-slate-700">
            {tl("country")}
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
            {tl("address")}
          </label>
          <input
            id="loc-address"
            name="address"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder={tl("optional")}
          />
        </div>

        <div>
          <label htmlFor="loc-lat" className="block text-xs font-medium text-slate-700">
            {tl("latitude")}
          </label>
          <input
            id="loc-lat"
            name="latitude"
            type="text"
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder={tl("optional")}
          />
        </div>

        <div>
          <label htmlFor="loc-lng" className="block text-xs font-medium text-slate-700">
            {tl("longitude")}
          </label>
          <input
            id="loc-lng"
            name="longitude"
            type="text"
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder={tl("optional")}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? tl("saving") : tl("addSubmit")}
        </button>
      </div>
    </form>
  )
}
