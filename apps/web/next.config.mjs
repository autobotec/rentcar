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

const API_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4106/api"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: API_URL,
    API_BASE_URL: API_URL,
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
    ],
  },
}

export default withNextIntl(nextConfig)


