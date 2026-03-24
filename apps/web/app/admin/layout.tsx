import Link from "next/link"
import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { routing } from "../../i18n/routing"
import { logout } from "./login/actions"
import { AdminLocaleSwitcher } from "./AdminLocaleSwitcher"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value
  const locale = localeCookie && routing.locales.includes(localeCookie as "es" | "en" | "fr")
    ? localeCookie
    : routing.defaultLocale
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-bold text-slate-800">
              Panel Admin
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin" className="text-slate-600 hover:text-slate-900">
                Inicio
              </Link>
              <Link href="/admin/vehicles" className="text-slate-600 hover:text-slate-900">
                Vehículos
              </Link>
              <Link href="/admin/reservations" className="text-slate-600 hover:text-slate-900">
                Reservas
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <AdminLocaleSwitcher currentLocale={locale} />
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              ← Volver al sitio
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-slate-600 hover:text-slate-900">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
    </NextIntlClientProvider>
  )
}
