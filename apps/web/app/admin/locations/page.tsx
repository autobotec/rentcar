import { getTranslations } from "next-intl/server"
import { AdminPageHeading } from "../../../components/AdminPageHeading"
import { getLocations } from "../vehicles/actions"
import { AddLocationForm } from "./AddLocationForm"
import { LocationsTable } from "./LocationsTable"

type LocationRow = {
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

export default async function AdminLocationsPage() {
  const raw = (await getLocations()) as LocationRow[]
  const t = await getTranslations("admin.locations")

  return (
    <div className="text-right">
      <AdminPageHeading>{t("title")}</AdminPageHeading>
      <p className="mt-1 text-sm text-slate-600">{t("intro")}</p>

      <AddLocationForm />

      {raw.length === 0 ? (
        <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t("emptyWarn")}
        </p>
      ) : (
        <LocationsTable
          locations={raw.map((loc) => ({
            ...loc,
            latitude: loc.latitude ?? null,
            longitude: loc.longitude ?? null,
          }))}
        />
      )}
    </div>
  )
}
