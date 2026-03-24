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
  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
}
