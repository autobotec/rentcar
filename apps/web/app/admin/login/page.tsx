import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { login } from "./actions"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  const store = await cookies()
  const hasSession = !!store.get("admin_session")
  if (hasSession) {
    redirect("/admin")
  }
  const params = await searchParams
  const from = params.from ?? "/admin"
  const t = await getTranslations("admin.login")

  const errorMap: Record<string, string> = {
    config: t("errorConfig"),
    empty: t("errorEmpty"),
    invalid: t("errorInvalid"),
  }
  const errorMsg = params.error ? errorMap[params.error] ?? t("errorGeneric") : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mb-6 text-center text-sm text-slate-500">{t("subtitle")}</p>
        {errorMsg && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</p>
        )}
        <form action={login} className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label htmlFor="password" className="sr-only">
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            {t("submit")}
          </button>
        </form>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            {t("backSite")}
          </Link>
        </p>
      </div>
    </div>
  )
}
