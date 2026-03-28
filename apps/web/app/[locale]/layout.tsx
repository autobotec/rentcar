import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }, { locale: "fr" }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header />
        {/* Misma altura total del header (h-24 = 14 + 10) */}
        <div className="flex-1 pt-24">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
