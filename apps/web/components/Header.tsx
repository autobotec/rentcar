"use client"

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
      className="fixed left-0 right-0 top-0 z-50 flex h-24 flex-col border-b border-zinc-800 bg-black shadow-md backdrop-blur-md"
      style={{ position: "fixed", top: 0, left: 0, right: 0 }}
    >
      {/* Fila de navegación */}
      <div className="relative mx-auto flex h-14 w-full max-w-6xl shrink-0 items-center justify-between px-4">
        <Link href="/" aria-label="Inicio" className="flex items-center">
          <span className="sr-only">Inicio</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/#fleet"
            className="font-medium text-zinc-200 transition hover:text-teal-400"
          >
            {t("fleet")}
          </Link>
          <Link
            href="/contact"
            className="font-medium text-zinc-200 transition hover:text-teal-400"
          >
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
                className={`rounded px-2 py-1 text-sm transition ${
                  locale === loc.code
                    ? "font-semibold text-teal-400"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {loc.label}
              </Link>
            ))}
          </div>
          <Link
            href="/my-reservations"
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-md transition hover:opacity-95"
            style={{ backgroundColor: "var(--logo-crimson)" }}
          >
            {t("myReservations")}
          </Link>
        </div>
      </div>
      {/* Franja extra que cubre la parte superior del vídeo (p. ej. marca de agua del export) */}
      <div className="h-10 w-full shrink-0 bg-black" aria-hidden />
    </header>
  )
}
