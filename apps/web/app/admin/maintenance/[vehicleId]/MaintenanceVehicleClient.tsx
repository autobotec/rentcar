"use client"

import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { MaintenanceRecord } from "../actions"
import { dateLocaleTag } from "../../../../lib/dateLocaleTag"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"

const CATEGORY_VALUES = [
  "oil_change",
  "brakes",
  "cleaning",
  "parts",
  "taxes",
  "insurance",
  "tires",
  "battery",
  "inspection",
  "other",
] as const

type Props = {
  vehicleSlug: string
  vehicleLabel: string
  initialRecords: MaintenanceRecord[]
}

export function MaintenanceVehicleClient({ vehicleSlug, vehicleLabel, initialRecords }: Props) {
  const t = useTranslations("admin.maintenance")
  const locale = useLocale()
  const dateLoc = dateLocaleTag(locale)
  const router = useRouter()
  const [records, setRecords] = useState(initialRecords)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    performedAt: new Date().toISOString().slice(0, 16),
    mileageKm: "",
    category: "oil_change",
    title: "",
    description: "",
    amount: "",
    currency: "USD",
  })

  const apiPath = encodeURIComponent(vehicleSlug)

  const refresh = async () => {
    const res = await fetch(`${API}/vehicle-maintenance/vehicle/${apiPath}`, { cache: "no-store" })
    if (res.ok) {
      const data = (await res.json()) as MaintenanceRecord[]
      setRecords(data)
    }
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const mileageKm = form.mileageKm.trim() ? parseInt(form.mileageKm, 10) : null
      if (form.mileageKm.trim() && (mileageKm == null || mileageKm < 0)) {
        throw new Error(t("invalidMileage"))
      }
      const amount = parseFloat(form.amount) || 0
      const res = await fetch(`${API}/vehicle-maintenance/vehicle/${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          performedAt: new Date(form.performedAt).toISOString(),
          mileageKm,
          category: form.category,
          title: form.title.trim() || null,
          description: form.description.trim() || null,
          amount,
          currency: form.currency.trim() || "USD",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data as { message?: string }).message || t("errorSave"))
      }
      setForm((f) => ({
        ...f,
        title: "",
        description: "",
        amount: "",
        mileageKm: "",
      }))
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorSave"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`${API}/vehicle-maintenance/vehicle/${apiPath}/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(t("errorDelete"))
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorDelete"))
    } finally {
      setDeletingId(null)
    }
  }

  const catLabel = (c: string) => t(`category_${c}` as "category_oil_change")

  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("newRecordTitle")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("newRecordHint")}</p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t("labelDate")}</label>
            <input
              type="datetime-local"
              required
              value={form.performedAt}
              onChange={(e) => setForm((f) => ({ ...f, performedAt: e.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t("labelMileage")}</label>
            <input
              type="number"
              min={0}
              placeholder={t("mileageOptional")}
              value={form.mileageKm}
              onChange={(e) => setForm((f) => ({ ...f, mileageKm: e.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-slate-600">{t("labelCategory")}</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {catLabel(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t("labelTitle")}</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={t("titlePlaceholder")}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t("labelAmount")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="w-20 rounded-md border border-slate-300 px-2 py-2 text-sm uppercase"
                maxLength={3}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-slate-600">{t("labelNotes")}</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? t("saving") : t("submitAdd")}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("historyTitle", { label: vehicleLabel })}
          </h2>
          <p className="text-sm text-slate-600">{t("historyOrder")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                  {t("colDate")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                  {t("colKm")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                  {t("colCategory")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                  {t("colDetail")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                  {t("colAmount")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">
                  {t("colDash")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {t("emptyRecords")}
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {new Date(rec.performedAt).toLocaleString(dateLoc)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {rec.mileageKm != null
                        ? `${rec.mileageKm.toLocaleString(dateLoc)} km`
                        : t("dash")}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{catLabel(rec.category)}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-600">
                      <span className="font-medium text-slate-800">{rec.title || t("dash")}</span>
                      {rec.description && (
                        <span className="mt-0.5 block text-xs text-slate-500">{rec.description}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {rec.amount > 0 ? `${rec.currency} ${rec.amount.toFixed(2)}` : t("dash")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDelete(rec.id)}
                        disabled={deletingId === rec.id}
                        className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
