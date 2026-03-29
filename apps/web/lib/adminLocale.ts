import { cookies } from "next/headers"
import { routing } from "../i18n/routing"

export type AppLocale = (typeof routing.locales)[number]

export async function getAdminLocale(): Promise<AppLocale> {
  const store = await cookies()
  const v = store.get("NEXT_LOCALE")?.value
  if (v && routing.locales.includes(v as AppLocale)) {
    return v as AppLocale
  }
  return routing.defaultLocale
}
