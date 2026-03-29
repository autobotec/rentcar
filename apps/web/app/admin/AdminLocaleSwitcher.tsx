"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
] as const

export function AdminLocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations("common")
  const router = useRouter()

  function setLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("language")}>
      {LOCALES.map((loc) => (
        <button
          key={loc.code}
          type="button"
          onClick={() => setLocale(loc.code)}
          className={`rounded px-2 py-1 text-sm ${
            currentLocale === loc.code
              ? "font-semibold text-teal-400"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  )
}
