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
    <div className="flex min-h-screen flex-col bg-slate-100">
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
              <Link href="/admin/locations" className="text-slate-600 hover:text-slate-900">
                Ubicaciones
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="mt-auto bg-gradient-to-t from-black via-zinc-950 to-zinc-900 px-4 py-4 text-center text-sm text-slate-400">
        <p>
          Design by:{" "}
          <a
            href="https://autobotec.net"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-400 underline-offset-2 hover:text-teal-300 hover:underline"
          >
            autobotec.net
          </a>
        </p>
      </footer>
    </div>
    </NextIntlClientProvider>
  )
}
