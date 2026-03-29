/**
 * Fusiona messages/admin-fragment-{es,en,fr}.json en messages/{es,en,fr}.json
 * (elimina adminVehicle y asigna admin). Ejecutar desde la raíz del monorepo:
 * node scripts/merge-admin-messages.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const messagesDir = path.join(root, "apps", "web", "messages")

for (const loc of ["es", "en", "fr"]) {
  const mainPath = path.join(messagesDir, `${loc}.json`)
  const fragPath = path.join(messagesDir, `admin-fragment-${loc}.json`)
  const main = JSON.parse(fs.readFileSync(mainPath, "utf8"))
  const admin = JSON.parse(fs.readFileSync(fragPath, "utf8"))
  delete main.adminVehicle
  main.admin = admin
  fs.writeFileSync(mainPath, JSON.stringify(main, null, 2) + "\n")
  console.log("merged", loc)
}
