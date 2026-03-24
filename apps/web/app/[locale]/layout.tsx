import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Header } from "../../components/Header"

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
      <Header />
      {/* Offset para que el contenido no “pise” el header fixed */}
      <div className="pt-16">{children}</div>
    </NextIntlClientProvider>
  )
}
