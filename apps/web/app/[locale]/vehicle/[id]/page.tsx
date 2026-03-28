import { getTranslations } from "next-intl/server"
import { ProductJsonLd } from "../../../../components/JsonLd"
import { InfoImportanteModal } from "../../../../components/InfoImportanteModal"
import TerminosCompletosAcordeon from "../../../../components/TerminosCompletosAcordeon"

type Vehicle = {
  id: string
  publicCode?: string | null
  brand: string
  model: string
  year: number | null
  transmission: string
  fuelType: string
  capacity: number
  basePricePerDay: number
  currency: string
  description: string | null
  engine?: string | null
  driveType?: string | null
  images?: { url: string }[]
  location: {
    name: string
    region: string | null
    code: string | null
  } | null
}

async function getVehicle(id: string, locale?: string): Promise<Vehicle | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4100/api"
  const url = new URL(`${baseUrl}/vehicles/${id}`)
  if (locale) url.searchParams.set("locale", locale)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as Vehicle
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const vehicle = await getVehicle(id, locale)
  const t = await getTranslations("vehiclePage")
  if (!vehicle) return { title: t("vehicleNotFoundTitle") }
  const title = `${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ""} | EsAnibal Rent Car`
  const description =
    vehicle.description ||
    `Alquiler de ${vehicle.brand} ${vehicle.model} en República Dominicana. Desde ${vehicle.currency} ${vehicle.basePricePerDay}/día.`
  return { title, description }
}

export default async function VehiclePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ pickup?: string; dropoff?: string }>
}) {
  const { id, locale } = await params
  const sp = await searchParams
  const t = await getTranslations("vehiclePage")
  const tCommon = await getTranslations("common")
  const vehicle = await getVehicle(id, locale)
  const defaultPickup = sp.pickup ? sp.pickup.slice(0, 16) : ""
  const defaultDropoff = sp.dropoff ? sp.dropoff.slice(0, 16) : ""

  if (!vehicle) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>{t("vehicleNotFound")}</p>
      </main>
    )
  }

  const motor = vehicle.engine ?? "—"
  const traccion = vehicle.driveType ?? "—"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  const vehicleSlug = vehicle.publicCode || vehicle.id
  const vehicleUrl = baseUrl ? `${baseUrl}/${locale}/vehicle/${encodeURIComponent(vehicleSlug)}` : ""

  const formatTransmission = (x: string) =>
    x === "automatic" ? t("automatic") : x === "manual" ? t("manual") : x.toUpperCase()
  const formatFuel = (x: string) => {
    const key = x as "gasoline" | "diesel" | "hybrid" | "electric"
    if (key === "gasoline") return t("gasoline")
    if (key === "diesel") return t("diesel")
    if (key === "hybrid") return t("hybrid")
    if (key === "electric") return t("electric")
    return x.toUpperCase()
  }

  const imageList = vehicle.images?.length ? vehicle.images : []
  const galleryImages: { url: string }[] = []
  for (let i = 0; i < 3; i++) {
    galleryImages.push(imageList.length ? imageList[i % imageList.length]! : { url: "" })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {vehicleUrl ? (
        <ProductJsonLd
          name={`${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ""}`}
          description={vehicle.description}
          image={vehicle.images?.[0]?.url}
          price={vehicle.basePricePerDay}
          currency={vehicle.currency}
          url={vehicleUrl}
        />
      ) : null}
      <section className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4">
          <div className="grid grid-cols-3 gap-2 w-full">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                {img.url ? (
                  <img
                    src={img.url}
                    alt={`${vehicle.brand} ${vehicle.model} - foto ${i + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    {tCommon("noImage")}
                  </div>
                )}
                {/* Marca de agua del logo en la galería */}
                {img.url ? (
                  <>
                    <img
                      src="/logo.png"
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute left-2 bottom-2 h-[666px] w-[375px] max-h-full max-w-full object-contain drop-shadow-2xl brightness-110 opacity-30"
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="mt-2 text-lg font-semibold text-slate-700">
                {t("usualPrice")}{" "}
                <span className="text-teal-600">
                  {vehicle.currency} {vehicle.basePricePerDay.toLocaleString("es-DO")}
                  <span className="text-sm font-normal text-slate-500"> {tCommon("perDay")}</span>
                </span>
              </p>
              {vehicle.location && (
                <p className="mt-1 text-sm text-slate-500">
                  {vehicle.location.name}
                  {vehicle.location.code ? ` (${vehicle.location.code})` : ""}
                  {vehicle.location.region ? ` · ${vehicle.location.region}` : ""}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <InfoImportanteModal />
            </div>
          </div>
        </header>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase text-slate-500 mb-3">{t("specs")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 uppercase text-xs">{t("engine")}</p>
              <p className="font-medium">{motor}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs">{t("transmission")}</p>
              <p className="font-medium">{formatTransmission(vehicle.transmission)}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs">{t("fuelType")}</p>
              <p className="font-medium">{formatFuel(vehicle.fuelType)}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs">{t("driveType")}</p>
              <p className="font-medium">{traccion}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs">{t("seats")}</p>
              <p className="font-medium">{vehicle.capacity}</p>
            </div>
          </div>
        </section>

        {vehicle.description && (
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">{vehicle.description}</p>
          </section>
        )}

        <section className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("agendaNow")}</h2>
          <form method="GET" action={`/${locale}/checkout`} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="vehicleId" value={vehicle.id} />
            <div className="flex flex-col">
              <label htmlFor="pickup" className="text-sm font-medium text-slate-700">
                {t("pickupLabel")}
              </label>
              <input
                id="pickup"
                name="pickup"
                type="datetime-local"
                required
                defaultValue={defaultPickup}
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="dropoff" className="text-sm font-medium text-slate-700">
                {t("returnLabel")}
              </label>
              <input
                id="dropoff"
                name="dropoff"
                type="datetime-local"
                required
                defaultValue={defaultDropoff}
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                {t("continueToReservation")}
              </button>
            </div>
          </form>
        </section>

        <TerminosCompletosAcordeon />
      </section>
    </main>
  )
}
