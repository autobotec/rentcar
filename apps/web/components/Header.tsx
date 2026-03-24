"use client"

import NextLink from "next/link"
import { Link, usePathname } from "../app/navigation"
import { useTranslations, useLocale } from "next-intl"

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
] as const

export function Header() {
  const t = useTranslations("common")
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-amber-200/80 bg-amber-50/95 backdrop-blur-md shadow-sm relative"
      style={{ position: "fixed", top: 0, left: 0, right: 0 }}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Inicio" className="flex items-center">
          <span className="sr-only">Inicio</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          <Link href="/#fleet" className="font-medium text-teal-700 hover:text-[var(--logo-crimson)]">
            {t("fleet")}
          </Link>
          <Link href="/#locations" className="font-medium text-teal-700 hover:text-[var(--logo-crimson)]">
            {t("locations")}
          </Link>
          <Link href="/#contact" className="font-medium text-teal-700 hover:text-[var(--logo-crimson)]">
            {t("contact")}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label={t("language")}>
            {LOCALES.map((loc) => (
              <Link
                key={loc.code}
                href={pathname || "/"}
                locale={loc.code}
                className={`rounded px-2 py-1 text-sm ${
                  locale === loc.code
                    ? "font-semibold text-[var(--logo-crimson)]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {loc.label}
              </Link>
            ))}
          </div>
          <NextLink href="/admin" className="text-xs text-slate-600 hover:text-[var(--logo-crimson)]">
            {t("admin")}
          </NextLink>
          <Link
            href="/my-reservations"
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-md transition hover:opacity-95"
            style={{ backgroundColor: "var(--logo-crimson)" }}
          >
            {t("myReservations")}
          </Link>
        </div>
      </div>
    </header>
  )
}
