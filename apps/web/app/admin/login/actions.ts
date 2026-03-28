"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { routing } from "../../../i18n/routing"

const ADMIN_SESSION = "admin_session"

function adminSessionOpts() {
  return {
    path: "/" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  }
}

function loginRedirect(from: string, error: string) {
  const q = new URLSearchParams({ error })
  if (from && from.startsWith("/admin")) q.set("from", from)
  redirect(`/admin/login?${q.toString()}`)
}

export async function login(formData: FormData) {
  const password = (formData.get("password") as string)?.trim() ?? ""
  const from = (formData.get("from") as string) || "/admin"
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) loginRedirect(from, "config")
  if (!password) loginRedirect(from, "empty")
  if (password !== expected) loginRedirect(from, "invalid")
  const store = await cookies()
  store.set(ADMIN_SESSION, "1", {
    ...adminSessionOpts(),
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect(from.startsWith("/admin") ? from : "/admin")
}

export async function logout() {
  const store = await cookies()
  const opts = adminSessionOpts()
  // Hay que coincidir con path/atributos del Set-Cookie original; si no, el navegador no la quita.
  store.delete({ name: ADMIN_SESSION, path: opts.path })
  store.set(ADMIN_SESSION, "", { ...opts, maxAge: 0 })
  const localeCookie = store.get("NEXT_LOCALE")?.value
  const locale =
    localeCookie && routing.locales.includes(localeCookie as (typeof routing.locales)[number])
      ? localeCookie
      : routing.defaultLocale
  redirect(`/${locale}`)
}
