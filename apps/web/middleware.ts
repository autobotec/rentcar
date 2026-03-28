import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // Redirigir /es/admin/login, /en/admin/..., etc. → /admin/login, /admin/...
  const localeAdminMatch = pathname.match(/^\/(es|en|fr)\/admin(\/.*)?$/)
  if (localeAdminMatch) {
    const rest = localeAdminMatch[2] ?? ""
    return NextResponse.redirect(new URL(`/admin${rest}`, request.url))
  }

  // Panel admin (sin prefijo de idioma): exigir cookie antes de next-intl
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login"
    const session = request.cookies.get("admin_session")?.value
    if (!isLogin && !session) {
      const login = new URL("/admin/login", request.url)
      login.searchParams.set("from", pathname)
      return NextResponse.redirect(login)
    }
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  // Incluir /admin para poder validar sesión; excluir estáticos y API
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
