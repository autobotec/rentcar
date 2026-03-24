"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
  store.set("admin_session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  redirect(from.startsWith("/admin") ? from : "/admin")
}

export async function logout() {
  const store = await cookies()
  store.delete("admin_session")
  redirect("/admin/login")
}
