import { getTranslations } from "next-intl/server"
import { Link } from "../../navigation"
import { VehicleCard } from "../../../components/VehicleCard"

type Vehicle = {
  id: string
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
  location: {
    name: string
    region: string | null
    code: string | null
  } | null
}

type SearchParams = {
  locationCode?: string
  pickup?: string
  dropoff?: string
  transmission?: string
  fuelType?: string
  minPrice?: string
  maxPrice?: string
  capacity?: string
  airConditioning?: string
}

function getDays(pickup: string, dropoff: string): number {
  const a = new Date(pickup).getTime()
  const b = new Date(dropoff).getTime()
  if (isNaN(a) || isNaN(b) || b <= a) return 0
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24)) || 1
}

const TAX_INSURANCE_PERCENT = 15

async function getVehicles(params: SearchParams & { locale?: string }): Promise<Vehicle[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4100/api"
  const url = new URL(`${baseUrl}/vehicles`)
  if (params.locationCode) url.searchParams.set("locationCode", params.locationCode)
  if (params.locale) url.searchParams.set("locale", params.locale)
  if (params.pickup) url.searchParams.set("pickupDatetime", params.pickup)
  if (params.dropoff) url.searchParams.set("dropoffDatetime", params.dropoff)
  if (params.transmission) url.searchParams.set("transmission", params.transmission)
  if (params.fuelType) url.searchParams.set("fuelType", params.fuelType)
  if (params.minPrice) url.searchParams.set("minPrice", params.minPrice)
  if (params.maxPrice) url.searchParams.set("maxPrice", params.maxPrice)
  if (params.capacity) url.searchParams.set("capacity", params.capacity)
  if (params.airConditioning !== undefined && params.airConditioning !== "")
    url.searchParams.set("airConditioning", params.airConditioning)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) return []
  return (await res.json()) as Vehicle[]
}

function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(locale === "es" ? "es-DO" : locale === "fr" ? "fr-FR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export default async function SearchPage({
  searchParams,
  params,
}: {
  searchParams: Promise<SearchParams>
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const p = await searchParams
  const t = await getTranslations("search")
  const tVehicle = await getTranslations("vehicleCard")
  const vehicles = await getVehicles({ ...p, locale })
  const days = p.pickup && p.dropoff ? getDays(p.pickup, p.dropoff) : 0
  const hasDates = days > 0

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            {p.locationCode && (
              <span>
                {t("location")}: <strong>{p.locationCode}</strong>
              </span>
            )}
            {p.pickup && (
              <span>{t("pickup")}: {formatDate(p.pickup, locale)}</span>
            )}
            {p.dropoff && (
              <span>{t("return")}: {formatDate(p.dropoff, locale)}</span>
            )}
            {hasDates && (
              <span>{days} {days !== 1 ? t("daysPlural") : t("days")}</span>
            )}
          </div>
          <form
            method="GET"
            action={`/${locale}/search`}
            className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 shadow-sm"
          >
            <input type="hidden" name="locationCode" value={p.locationCode ?? ""} />
            <input type="hidden" name="pickup" value={p.pickup ?? ""} />
            <input type="hidden" name="dropoff" value={p.dropoff ?? ""} />
            <div className="flex flex-col">
              <label htmlFor="transmission" className="text-xs font-medium text-slate-600">{t("transmission")}</label>
              <select id="transmission" name="transmission" defaultValue={p.transmission ?? ""} className="mt-0.5 rounded border border-slate-300 px-2 py-1.5 text-sm">
                <option value="">{t("all")}</option>
                <option value="automatic">{tVehicle("automatic")}</option>
                <option value="manual">{tVehicle("manual")}</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="fuelType" className="text-xs font-medium text-slate-600">{t("fuelType")}</label>
              <select id="fuelType" name="fuelType" defaultValue={p.fuelType ?? ""} className="mt-0.5 rounded border border-slate-300 px-2 py-1.5 text-sm">
                <option value="">{t("all")}</option>
                <option value="gasoline">{tVehicle("gasoline")}</option>
                <option value="diesel">{tVehicle("diesel")}</option>
                <option value="hybrid">{tVehicle("hybrid")}</option>
                <option value="electric">{tVehicle("electric")}</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="capacity" className="text-xs font-medium text-slate-600">{t("minSeats")}</label>
              <input id="capacity" name="capacity" type="number" min={1} max={20} defaultValue={p.capacity ?? ""} placeholder="—" className="mt-0.5 w-20 rounded border border-slate-300 px-2 py-1.5 text-sm" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="minPrice" className="text-xs font-medium text-slate-600">{t("minPrice")}</label>
              <input id="minPrice" name="minPrice" type="number" min={0} step={1} defaultValue={p.minPrice ?? ""} placeholder="—" className="mt-0.5 w-24 rounded border border-slate-300 px-2 py-1.5 text-sm" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="maxPrice" className="text-xs font-medium text-slate-600">{t("maxPrice")}</label>
              <input id="maxPrice" name="maxPrice" type="number" min={0} step={1} defaultValue={p.maxPrice ?? ""} placeholder="—" className="mt-0.5 w-24 rounded border border-slate-300 px-2 py-1.5 text-sm" />
            </div>
            <button type="submit" className="rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
              {t("filter")}
            </button>
          </form>
        </header>

        {vehicles.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <p className="text-slate-600">{t("noResults")}</p>
            <p className="mt-2 text-sm text-slate-500">{t("tryOther")}</p>
            <Link href="/" className="mt-4 inline-block rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
              {t("newSearch")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} locale={locale} pickup={p.pickup} dropoff={p.dropoff} taxInsurancePercent={TAX_INSURANCE_PERCENT} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
