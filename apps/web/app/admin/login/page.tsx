import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { login } from "./actions"

const ERROR_MSG: Record<string, string> = {
  config: "No está configurado ADMIN_PASSWORD en el servidor.",
  empty: "Introduce la contraseña.",
  invalid: "Contraseña incorrecta.",
}

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
  const errorMsg = params.error ? ERROR_MSG[params.error] ?? "Error al iniciar sesión." : null

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 text-center mb-1">
          Panel Admin
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Introduce la contraseña de administrador
        </p>
        {errorMsg && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </p>
        )}
        <form action={login} className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Contraseña"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  )
}
