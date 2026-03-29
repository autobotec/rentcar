"use client"

import { useTranslations } from "next-intl"
import { Link } from "../app/navigation"

/** Misma posición fija que en el home; usar dentro de `NextIntlClientProvider` + rutas `[locale]`. */
export function FloatingBrandLogo() {
  const t = useTranslations("common")

  return (
    <div className="pointer-events-none fixed -top-18 left-6 z-[9999]">
      <Link href="/" className="pointer-events-auto inline-block">
        <img
          src="/logo.png"
          alt={t("brand")}
          className="w-44 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
          width={176}
          height={120}
          decoding="async"
        />
      </Link>
    </div>
  )
}
