import NextLink from "next/link"
import { getTranslations } from "next-intl/server"
import { Link } from "../app/navigation"
import { getWhatsAppHref } from "../lib/whatsapp"
import { WhatsAppOfficialButton } from "./WhatsAppOfficialButton"
import { FooterAssistantLink } from "./FooterAssistantLink"

export async function Footer() {
  const t = await getTranslations("common")
  const tf = await getTranslations("footer")
  const wa = getWhatsAppHref()

  return (
    <footer
      id="contact"
      className="relative z-10 mt-auto scroll-mt-24 border-t border-zinc-800 bg-black py-8 text-slate-300"
    >
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="grid gap-8 text-sm md:grid-cols-3 md:gap-6 md:text-left">
          <div>
            <p className="font-semibold text-white">{tf("offices")}</p>
            <p className="mt-2 leading-relaxed text-slate-400">
              <span className="block font-medium text-slate-300">Santo Domingo</span>
              {tf("santoDomingo")}
            </p>
            <p className="mt-3 leading-relaxed text-slate-400">
              <span className="block font-medium text-slate-300">La Romana</span>
              {tf("laRomana")}
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">{tf("phoneLabel")}</p>
            <p className="mt-2 text-lg font-mono text-slate-200">{tf("phoneValue")}</p>
            <p className="mt-4 text-xs text-slate-500">{tf("phoneNote")}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-teal-500/60 px-4 py-2 text-sm font-medium text-teal-400 transition hover:border-teal-400 hover:bg-teal-950/50"
            >
              {tf("contactForm")}
            </Link>
            {wa ? (
              <WhatsAppOfficialButton href={wa} label={tf("whatsapp")} />
            ) : (
              <p className="max-w-xs text-xs text-slate-500">{tf("whatsappHint")}</p>
            )}
            <FooterAssistantLink className="inline-flex rounded-full border border-violet-500/50 px-4 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-400 hover:bg-violet-950/40" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 border-t border-zinc-800 pt-6 text-center sm:flex-row sm:gap-6">
          <p className="text-sm text-slate-400">
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
          <span className="hidden text-zinc-600 sm:inline" aria-hidden>
            |
          </span>
          <NextLink
            href="/admin"
            className="text-sm font-medium text-slate-300 underline-offset-2 hover:text-white hover:underline"
          >
            {t("admin")}
          </NextLink>
        </div>
      </div>
    </footer>
  )
}
