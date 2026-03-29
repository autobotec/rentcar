"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { AppLocale } from "../lib/adminLocale"
import { routing } from "../i18n/routing"

function localeFromCookie(): AppLocale {
  if (typeof document === "undefined") return routing.defaultLocale
  const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
  const v = m?.[1]?.trim()
  return v && routing.locales.includes(v as AppLocale) ? (v as AppLocale) : routing.defaultLocale
}

/** Logo flotante como en el home, para rutas sin layout `[locale]` (cliente). */
export function FloatingBrandLogoStandalone() {
  const [locale, setLocale] = useState<AppLocale>(routing.defaultLocale)
  useEffect(() => setLocale(localeFromCookie()), [])

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
