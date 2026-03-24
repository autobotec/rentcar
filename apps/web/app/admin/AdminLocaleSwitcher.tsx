"use client"

import { useRouter } from "next/navigation"

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
] as const

export function AdminLocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter()

  function setLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Idioma">
      {LOCALES.map((loc) => (
        <button
          key={loc.code}
          type="button"
          onClick={() => setLocale(loc.code)}
          className={`rounded px-2 py-1 text-sm ${
            currentLocale === loc.code
              ? "font-semibold text-teal-700"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  )
}
