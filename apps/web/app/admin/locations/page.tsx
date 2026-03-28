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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Ubicaciones</h1>
      <p className="mt-1 text-sm text-slate-600">
        Sucursales y puntos de servicio. Puedes registrar nuevas ubicaciones aquí; se guardan en la base de datos vía API.
      </p>

      <AddLocationForm />

      {raw.length === 0 ? (
        <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No se cargaron ubicaciones. Comprueba que la API esté en marcha.
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
