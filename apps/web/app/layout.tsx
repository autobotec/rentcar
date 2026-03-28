import "./globals.css"
import { LocalBusinessJsonLd } from "../components/JsonLd"

export const metadata = {
  title: "EsAnibal Rent Car",
  description: "Renta de autos en República Dominicana. Reserva en Punta Cana, Santo Domingo y más.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-200 text-slate-900">
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  )
}



