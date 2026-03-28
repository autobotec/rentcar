import { getTranslations } from "next-intl/server"
import { Link } from "../../navigation"
import { ContactForm } from "../../../components/ContactForm"

export default async function ContactPage() {
  const t = await getTranslations("contactPage")
  const tCommon = await getTranslations("common")

  return (
    <main className="min-h-screen bg-zinc-300 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("intro")}</p>
      </div>
      <div className="mx-auto mt-8 max-w-lg">
        <ContactForm />
      </div>
      <p className="mx-auto mt-10 max-w-lg text-center">
        <Link href="/" className="text-sm font-medium text-teal-800 hover:underline">
          ← {tCommon("brand")}
        </Link>
      </p>
    </main>
  )
}
