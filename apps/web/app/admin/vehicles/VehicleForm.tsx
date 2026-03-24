"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Toast } from "../../../components/Toast"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4100/api"
const MIN_IMAGES = 1
const MAX_IMAGES = 100 // sin límite práctico; mínimo 1
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4 MB
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"]
const ACCEPT_TYPES = "image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"

type Location = { id: string; name: string; code: string | null }
type VehicleImage = { id: string; url: string; isPrimary: boolean }
type PendingFile = { file: File; preview: string }

type VehicleFormProps = {
  locations: Location[]
  initialData?: {
    id: string
    locationId: string | null
    brand: string
    model: string
    year: number | null
    transmission: string
    fuelType: string
    capacity: number
    doors: number | null
    airConditioning: boolean
    luggage: number | null
    basePricePerDay: number
    currency: string
    status: string
    description: string | null
    engine: string | null
    driveType: string | null
    images: VehicleImage[]
  } | null
}

function normalizeImageUrl(url: string): string {
  if (!url) return url
  const idx = url.indexOf("/uploads/")
  if (idx !== -1) return url.slice(idx)
  return url
}

function validateFile(file: File): string | null {
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")
  if (!ALLOWED_EXTENSIONS.includes(ext)) return "Formato no permitido. Use: JPG, PNG, JPEG, WEBP o SVG."
  if (file.size > MAX_FILE_SIZE) return "Cada foto debe pesar como máximo 4 MB."
  return null
}

type ToastState = { type: "success" | "error"; message: string } | null

export function VehicleForm({ locations, initialData }: VehicleFormProps) {
  const t = useTranslations("adminVehicle")
  const isEdit = !!initialData
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>(null)
  const [images, setImages] = useState<VehicleImage[]>(initialData?.images ?? [])
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])

  const [form, setForm] = useState({
    locationId: initialData?.locationId ?? "",
    brand: initialData?.brand ?? "",
    model: initialData?.model ?? "",
    year: initialData?.year ?? "",
    transmission: initialData?.transmission ?? "automatic",
    fuelType: initialData?.fuelType ?? "gasoline",
    capacity: initialData?.capacity ?? 5,
    doors: initialData?.doors ?? "",
    airConditioning: initialData?.airConditioning ?? true,
    luggage: initialData?.luggage ?? "",
    basePricePerDay: initialData?.basePricePerDay ?? "",
    currency: initialData?.currency ?? "USD",
    status: initialData?.status ?? "available",
    description: initialData?.description ?? "",
    engine: initialData?.engine ?? "",
    driveType: initialData?.driveType ?? "",
  })

  const imageCount = isEdit ? images.length : pendingFiles.length
  const hasEnoughImages = imageCount >= MIN_IMAGES && imageCount <= MAX_IMAGES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (imageCount < MIN_IMAGES) {
      setError(`Debes agregar al menos ${MIN_IMAGES} foto del vehículo.`)
      return
    }
    setSaving(true)
    try {
      const payload = {
        locationId: form.locationId || null,
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: form.year ? Number(form.year) : null,
        transmission: form.transmission,
        fuelType: form.fuelType,
        capacity: Number(form.capacity),
        doors: form.doors ? Number(form.doors) : null,
        airConditioning: form.airConditioning,
        luggage: form.luggage ? Number(form.luggage) : null,
        basePricePerDay: Number(form.basePricePerDay),
        currency: form.currency,
        status: form.status,
        description: form.description.trim() || null,
        engine: form.engine.trim() || null,
        driveType: form.driveType.trim() || null,
      }
      if (isEdit) {
        const res = await fetch(`${API}/vehicles/${initialData!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Error al guardar")
        setToast({ type: "success", message: t("toastSuccessSave") })
        setTimeout(() => {
          window.location.href = "/admin/vehicles"
        }, 1500)
        return
      } else {
        const res = await fetch(`${API}/vehicles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Error al crear")
        const vehicleId = data.id
        for (let i = 0; i < pendingFiles.length; i++) {
          const { file } = pendingFiles[i]
          const fd = new FormData()
          fd.append("file", file)
          const uploadRes = await fetch("/api/upload", { method: "POST", body: fd })
          const uploadData = await uploadRes.json()
          if (!uploadRes.ok) throw new Error(uploadData.error || "Error al subir foto")
          const url = uploadData.url.startsWith("http") ? uploadData.url : `${window.location.origin}${uploadData.url}`
          const addRes = await fetch(`${API}/vehicles/${vehicleId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, isPrimary: i === 0 }),
          })
          if (!addRes.ok) throw new Error("Error al asociar foto al vehículo")
        }
        setToast({ type: "success", message: t("toastSuccessCreate") })
        setTimeout(() => {
          window.location.href = "/admin/vehicles"
        }, 1500)
        return
      }
    } catch (err: unknown) {
      const reason = err instanceof Error ? err.message : "Error al guardar"
      setError(reason)
      const errorTitle = isEdit ? t("toastErrorTitle") : t("toastErrorCreateTitle")
      setToast({ type: "error", message: `${errorTitle}: ${reason}` })
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit || !initialData) return
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)


    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Formato no permitido. Use: JPG, PNG, JPEG, WEBP o SVG.`)
      e.target.value = ""
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Cada foto debe pesar como máximo 4 MB.")
      e.target.value = ""
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || "Error al subir")
      const url = uploadData.url.startsWith("http") ? uploadData.url : `${window.location.origin}${uploadData.url}`
      const addRes = await fetch(`${API}/vehicles/${initialData.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, isPrimary: images.length === 0 }),
      })
      const added = await addRes.json()
      if (!addRes.ok) throw new Error("Error al asociar imagen")
      setImages((prev) => [
        ...prev,
        { id: added.id, url: normalizeImageUrl(added.url), isPrimary: added.isPrimary },
      ])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleRemoveImage = async (imageId: string) => {
    if (!isEdit || !initialData) return
    try {
      const res = await fetch(`${API}/vehicles/${initialData.id}/images/${imageId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar")
      setImages((prev) => prev.filter((i) => i.id !== imageId))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar imagen")
    }
  }

  const handleAddPendingFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEdit) return
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    const err = validateFile(file)
    if (err) {
      setError(err)
      e.target.value = ""
      return
    }
    const preview = URL.createObjectURL(file)
    setPendingFiles((prev) => [...prev, { file, preview }])
    e.target.value = ""
  }

  const handleRemovePendingFile = (index: number) => {
    const item = pendingFiles[index]
    if (item) URL.revokeObjectURL(item.preview)
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Datos básicos */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Datos del vehículo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Marca *</label>
            <input
              type="text"
              required
              value={form.brand}
              onChange={(e) =>
                setForm((f) => ({ ...f, brand: e.target.value.toUpperCase() }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Modelo *</label>
            <input
              type="text"
              required
              value={form.model}
              onChange={(e) =>
                setForm((f) => ({ ...f, model: e.target.value.toUpperCase() }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Año</label>
            <input
              type="number"
              min="1990"
              max="2030"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Ubicación</label>
            <select
              value={form.locationId}
              onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">— Sin asignar —</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.code ? `(${loc.code})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Transmisión</label>
            <select
              value={form.transmission}
              onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="automatic">Automática</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Combustible</label>
            <select
              value={form.fuelType}
              onChange={(e) => setForm((f) => ({ ...f, fuelType: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="gasoline">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="hybrid">Híbrido</option>
              <option value="electric">Eléctrico</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Asientos</label>
            <input
              type="number"
              min="1"
              max="20"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) || 0 }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Puertas</label>
            <input
              type="number"
              min="2"
              max="6"
              value={form.doors}
              onChange={(e) => setForm((f) => ({ ...f, doors: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Maletero (piezas)</label>
            <input
              type="number"
              min="0"
              value={form.luggage}
              onChange={(e) => setForm((f) => ({ ...f, luggage: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Motor (ej. 4.0)</label>
            <input
              type="text"
              placeholder="—"
              value={form.engine}
              onChange={(e) => setForm((f) => ({ ...f, engine: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Tracción</label>
            <input
              type="text"
              placeholder="4X4, 4X2…"
              value={form.driveType}
              onChange={(e) => setForm((f) => ({ ...f, driveType: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="ac"
              checked={form.airConditioning}
              onChange={(e) => setForm((f) => ({ ...f, airConditioning: e.target.checked }))}
              className="rounded border-slate-300"
            />
            <label htmlFor="ac" className="text-sm text-slate-700">
              Aire acondicionado
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Estado</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Precio de alquiler</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Precio por día *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.basePricePerDay}
              onChange={(e) => setForm((f) => ({ ...f, basePricePerDay: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Moneda</label>
            <select
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="USD">USD</option>
              <option value="DOP">DOP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </section>

      {/* Fotos: mínimo 1, sin límite máximo */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Fotografías del vehículo</h2>
        <p className="mb-4 text-sm text-slate-500">
          Mínimo {MIN_IMAGES} foto. Formatos: JPG, PNG, JPEG, WEBP, SVG. Peso máximo 4 MB por imagen.
        </p>
        <div className="mb-4 flex flex-wrap gap-4">
          {isEdit
            ? images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={normalizeImageUrl(img.url)}
                    alt=""
                    className="h-24 w-32 rounded-lg border object-cover"
                  />
                  {/* Marca de agua (visual) */}
                  <img
                    src="/logo.png"
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute left-2 bottom-2 h-[666px] w-[375px] max-h-full max-w-full object-contain drop-shadow-2xl brightness-110 opacity-30"
                  />
                  {img.isPrimary && (
                    <span className="absolute left-1 top-1 z-20 rounded bg-teal-600 px-1.5 py-0.5 text-[10px] text-white">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute right-1 top-1 z-20 rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            : pendingFiles.map((item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item.preview}
                    alt=""
                    className="h-24 w-32 rounded-lg border object-cover"
                  />
                  {/* Marca de agua (visual) */}
                  <img
                    src="/logo.png"
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute left-2 bottom-2 h-[666px] w-[375px] max-h-full max-w-full object-contain drop-shadow-2xl brightness-110 opacity-30"
                  />
                  {index === 0 && (
                    <span className="absolute left-1 top-1 z-20 rounded bg-teal-600 px-1.5 py-0.5 text-[10px] text-white">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePendingFile(index)}
                    className="absolute right-1 top-1 z-20 rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isEdit ? (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
              <input
                type="file"
                accept={ACCEPT_TYPES}
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
              {uploading ? "Subiendo…" : "Subir foto"}
            </label>
          ) : (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
              <input
                type="file"
                accept={ACCEPT_TYPES}
                className="hidden"
                onChange={handleAddPendingFile}
              />
              Agregar foto
            </label>
          )}
          <span className="text-sm text-slate-500">
            {imageCount} {imageCount === 1 ? "foto" : "fotos"}
            {imageCount < MIN_IMAGES && (
              <span className="ml-1 text-amber-600">
                (mínimo {MIN_IMAGES})
              </span>
            )}
          </span>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || !hasEnoughImages}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear vehículo"}
        </button>
        {isEdit ? (
          <a
            href="/admin/vehicles"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Volver a la lista
          </a>
        ) : (
          <a
            href="/admin/vehicles"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </a>
        )}
      </div>
    </form>
  )
}
