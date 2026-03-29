import { cookies } from "next/headers"
import Link from "next/link"
import type { AppLocale } from "../lib/adminLocale"
import { routing } from "../i18n/routing"

/** Logo flotante como en el home, para páginas servidor fuera de `[locale]`. */
export async function FloatingBrandLogoRsc() {
  const jar = await cookies()
  const c = jar.get("NEXT_LOCALE")?.value
  const locale: AppLocale =
    c && routing.locales.includes(c as AppLocale) ? (c as AppLocale) : routing.defaultLocale

  return (
    <div className="pointer-events-none fixed -top-18 left-6 z-[9999]">
      <Link href={`/${locale}`} className="pointer-events-auto inline-block">
        <img
          src="/logo.png"
          alt="EsAnibal Rent Car"
          className="w-44 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
          width={176}
          height={120}
          decoding="async"
        />
      </Link>
    </div>
  )
}
