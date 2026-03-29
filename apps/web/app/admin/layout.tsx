import Link from "next/link"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { FloatingBrandLogo } from "../../components/FloatingBrandLogo"
import { Footer } from "../../components/Footer"
import { getAdminLocale } from "../../lib/adminLocale"
import { logout } from "./login/actions"
import { AdminLocaleSwitcher } from "./AdminLocaleSwitcher"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getAdminLocale()
  setRequestLocale(locale)
  const messages = (await import(`../../messages/${locale}.json`)).default
  const t = await getTranslations("admin.layout")

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-slate-100">
        <FloatingBrandLogo />
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-black shadow-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 pl-[max(1rem,calc(1.5rem+11rem))]">
            <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm md:gap-x-4">
              <Link href="/admin" className="font-medium text-zinc-200 transition hover:text-teal-400">
                {t("navHome")}
              </Link>
              <Link href="/admin/vehicles" className="font-medium text-zinc-200 transition hover:text-teal-400">
                {t("navVehicles")}
              </Link>
              <Link href="/admin/reservations" className="font-medium text-zinc-200 transition hover:text-teal-400">
                {t("navReservations")}
              </Link>
              <Link href="/admin/locations" className="font-medium text-zinc-200 transition hover:text-teal-400">
                {t("navLocations")}
              </Link>
              <Link href="/admin/maintenance" className="font-medium text-zinc-200 transition hover:text-teal-400">
                {t("navMaintenance")}
              </Link>
            </nav>
            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
              <AdminLocaleSwitcher currentLocale={locale} />
              <Link
                href={`/${locale}`}
                className="text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {t("backToSite")}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-zinc-400 transition hover:text-white"
                >
                  {t("logout")}
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 pt-24">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
