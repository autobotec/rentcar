import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { FloatingBrandLogo } from "../../components/FloatingBrandLogo"
import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"
import { AssistantChatWidget } from "../../components/AssistantChatWidget"
import { SitePublicBodyBackground } from "../../components/SitePublicBodyBackground"

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
        <FloatingBrandLogo />
        <Header />
        {/* Fondo imagen; hero del home tapa con vídeo + bg-black */}
        <div className="relative isolate flex min-h-0 flex-1 flex-col pt-24">
          <SitePublicBodyBackground />
          <div className="relative z-10 min-h-0 w-full flex-1">{children}</div>
        </div>
        <Footer />
        <AssistantChatWidget />
      </div>
    </NextIntlClientProvider>
  )
}
