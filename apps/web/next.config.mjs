import nextEnv from "@next/env"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import createNextIntlPlugin from "next-intl/plugin"

const { loadEnvConfig } = nextEnv
const __dirname = dirname(fileURLToPath(import.meta.url))
const monorepoRoot = join(__dirname, "..", "..")
// Monorepo: ADMIN_PASSWORD y otras vars suelen estar en la raíz; Next solo carga apps/web por defecto.
loadEnvConfig(monorepoRoot)
loadEnvConfig(__dirname)

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

// API_BASE_URL: llamada interna server-side (nunca sale del servidor)
const SERVER_API_URL =
  process.env.API_BASE_URL ||
  "http://localhost:4106/api"

// NEXT_PUBLIC_API_BASE_URL: lo que usa el navegador del cliente (URL pública)
const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4106/api"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: SERVER_API_URL,
    NEXT_PUBLIC_API_BASE_URL: PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4106",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.esanibalrentcar.com",
        pathname: "/uploads/**",
      },
    ],
  },
}

export default withNextIntl(nextConfig)


