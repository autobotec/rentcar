import { getTranslations } from "next-intl/server"
import { VehicleCard } from "../../components/VehicleCard"

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

async function getVehicles(locationCode?: string, locale?: string): Promise<Vehicle[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4106/api"
  const url = new URL(`${baseUrl}/vehicles`)
  if (locationCode) url.searchParams.set("locationCode", locationCode)
  if (locale) url.searchParams.set("locale", locale)

  try {
    const res = await fetch(url.toString(), { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function HomePage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ locationCode?: string }>
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations("home")

  let vehicles: Vehicle[] = []
  try {
    vehicles = await getVehicles(sp.locationCode, locale)
  } catch {
    vehicles = []
  }

  return (
    <main className="min-h-screen text-slate-900">
      {/* HERO: solo vídeo; bg-black evita que se vea la imagen global detrás */}
      <section className="relative z-0 min-h-[32rem] overflow-hidden bg-black">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/video_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-teal-900/45" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 items-end md:justify-end">
          <div className="w-full md:w-1/2 md:ml-auto text-right space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">
              {t("tagline")}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl drop-shadow-md">
              {t("heroTitle")}
            </h1>

            <p className="text-sm text-slate-200">{t("heroSub")}</p>

            <form
              className="mt-4 grid gap-3 rounded-xl bg-white p-4 shadow-lg md:grid-cols-[1fr,1fr,1fr,auto]"
              action={`/${locale}/search`}
              method="GET"
            >
              <div className="flex flex-col">
                <label htmlFor="locationCode" className="text-xs font-medium text-slate-800">
                  {t("cityAirport")}
                </label>
                <input
                  id="locationCode"
                  name="locationCode"
                  placeholder={t("cityPlaceholder")}
                  className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-xs"
                  defaultValue={sp.locationCode}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="pickup" className="text-xs font-medium text-slate-700">
                  {t("pickup")}
                </label>
                <input
                  id="pickup"
                  name="pickup"
                  type="datetime-local"
                  className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-xs"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="dropoff" className="text-xs font-medium text-slate-700">
                  {t("return")}
                </label>
                <input
                  id="dropoff"
                  name="dropoff"
                  type="datetime-local"
                  className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-md px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-95"
                  style={{ backgroundColor: "var(--logo-crimson)" }}
                >
                  {t("searchCar")}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 text-[11px] text-slate-200 md:justify-end">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                <span>{t("freeCancellation")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span>{t("support24")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                <span>{t("minRent")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                <span>{t("bestPrices")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-teal-100 border-l-4 border-teal-500 bg-white p-4 shadow-[0_10px_36px_-8px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold text-teal-800">{t("flexiblePickup")}</h3>
            <p className="mt-1 text-xs text-slate-600">{t("flexiblePickupDesc")}</p>
          </div>

          <div className="rounded-xl border border-amber-100 border-l-4 border-[var(--logo-crimson)] bg-white p-4 shadow-[0_10px_36px_-8px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold text-slate-900">{t("transparentPrices")}</h3>
            <p className="mt-1 text-xs text-slate-600">{t("transparentPricesDesc")}</p>
          </div>

          <div className="rounded-xl border border-orange-100 border-l-4 border-orange-500 bg-white p-4 shadow-[0_10px_36px_-8px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold text-orange-900">{t("supportLanguage")}</h3>
            <p className="mt-1 text-xs text-slate-600">{t("supportLanguageDesc")}</p>
          </div>
        </div>
      </section>

      {/* VEHICLES */}
      <section id="fleet" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">{t("ourCars")}</h2>
          <p className="mt-1 text-sm text-teal-700">{t("ourCarsDesc")}</p>
        </div>

        {vehicles.length === 0 ? (
          <div className="rounded-xl border border-zinc-400 bg-zinc-100 p-6 text-sm text-zinc-900">
            <p className="font-medium">{t("noVehiclesLoaded")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}