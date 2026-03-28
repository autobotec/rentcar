"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

export type VehicleCardData = {
  id: string
  /** Código legible para URLs (MARCA-MODELO-######); si falta, se usa id (UUID). */
  publicCode?: string | null
  brand: string
  model: string
  year: number | null
  transmission: string
  fuelType: string
  capacity: number
  basePricePerDay: number
  currency: string
  airConditioning?: boolean
  images?: { url: string }[]
  location?: {
    name: string
    region: string | null
    code: string | null
  } | null
}

type VehicleCardProps = {
  vehicle: VehicleCardData
  pickup?: string
  dropoff?: string
  taxInsurancePercent?: number
  /** Locale para enlaces (ej. es, en, fr). Si no se pasa, se usa /vehicle/... sin prefijo. */
  locale?: string
}

export function VehicleCard({
  vehicle,
  pickup,
  dropoff,
  taxInsurancePercent = 15,
  locale = "es",
}: VehicleCardProps) {
  const t = useTranslations("vehicleCard")
  const tCommon = useTranslations("common")
  const hasDates = Boolean(pickup && dropoff)
  const days =
    hasDates && pickup && dropoff
      ? Math.max(
          1,
          Math.ceil(
            (new Date(dropoff).getTime() - new Date(pickup).getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 0
  const subtotal = hasDates ? days * vehicle.basePricePerDay : vehicle.basePricePerDay
  const taxInsurance = (subtotal * taxInsurancePercent) / 100
  const totalEst = subtotal + taxInsurance
  const base = locale ? `/${locale}` : ""
  const vehicleSlug = vehicle.publicCode || vehicle.id
  const reserveHref =
    hasDates && pickup && dropoff
      ? `${base}/vehicle/${encodeURIComponent(vehicleSlug)}?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`
      : `${base}/vehicle/${encodeURIComponent(vehicleSlug)}`

  const transmissionLabel =
    vehicle.transmission === "automatic"
      ? t("automatic")
      : vehicle.transmission === "manual"
        ? t("manual")
        : vehicle.transmission
  const fuelLabel =
    vehicle.fuelType === "gasoline"
      ? t("gasoline")
      : vehicle.fuelType === "diesel"
        ? t("diesel")
        : vehicle.fuelType === "hybrid"
          ? t("hybrid")
          : vehicle.fuelType === "electric"
            ? t("electric")
            : vehicle.fuelType
  const specs = [
    vehicle.year ? `${vehicle.year}` : null,
    transmissionLabel,
    fuelLabel,
    `${vehicle.capacity} ${t("seats")}`,
    vehicle.airConditioning !== false ? "A/C" : null,
  ].filter(Boolean)

  // Normalizar URL de imagen: si viene con host (ej. http://localhost:3001/uploads/...)
  // extraemos siempre el path a partir de /uploads/ para que funcione en cualquier host.
  const rawImageUrl = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].url : null
  const imageUrl =
    rawImageUrl && rawImageUrl.includes("/uploads/")
      ? rawImageUrl.slice(rawImageUrl.indexOf("/uploads/"))
      : rawImageUrl

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-[0_10px_40px_-8px_rgba(0,0,0,0.38)] transition hover:border-teal-200 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.48)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Marca de agua del logo (375x666 base, limitado al contenedor) */}
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-2 bottom-2 h-[666px] w-[375px] max-h-full max-w-full object-contain drop-shadow-2xl brightness-110 opacity-30 transition-transform duration-300 ease-out hover:scale-105"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            {tCommon("noImage")}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {vehicle.brand} {vehicle.model}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">{specs.join(" · ")}</p>
        {vehicle.location && (
          <p className="mt-1 text-xs text-slate-400">
            {vehicle.location.name}
            {vehicle.location.code ? ` (${vehicle.location.code})` : ""}
            {vehicle.location.region ? ` · ${vehicle.location.region}` : ""}
          </p>
        )}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{tCommon("from")}</p>
              <p className="text-xl font-bold text-slate-900">
                {vehicle.currency} {vehicle.basePricePerDay.toLocaleString("es")}
                <span className="text-sm font-normal text-slate-500">{tCommon("perDay")}</span>
              </p>
            </div>
            {hasDates && (
              <div className="text-right">
                <p className="text-xs text-slate-500">{t("totalEst")}</p>
                <p className="text-base font-semibold text-slate-900">
                  {vehicle.currency} {totalEst.toFixed(0)}
                </p>
                <p className="text-[11px] text-slate-400">
                  {days} {days !== 1 ? t("daysPlusTaxPlural") : t("daysPlusTax")}
                </p>
              </div>
            )}
          </div>
        </div>
        <Link
          href={reserveHref}
          className="mt-4 block w-full rounded-xl py-3 text-center text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          style={{ backgroundColor: "var(--logo-crimson)" }}
        >
          {hasDates ? t("reserve") : t("viewDetails")}
        </Link>
      </div>
    </article>
  )
}
