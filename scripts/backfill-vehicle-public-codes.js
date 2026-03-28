/**
 * Rellena Vehicle.publicCode para filas existentes: MARCA-MODELO-###### (6 dígitos).
 * Ejecutar tras migración: node scripts/backfill-vehicle-public-codes.js
 */
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath) && !process.env.DATABASE_URL) {
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (t.startsWith('#') || !t.includes('=')) continue
    const i = t.indexOf('=')
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (key === 'DATABASE_URL') process.env.DATABASE_URL = val
  }
}

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function slugPart(s) {
  const n = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const raw = n
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase()
    .slice(0, 40)
  return raw || 'X'
}

async function allocateCode(brand, model, excludeId) {
  const prefix = `${slugPart(brand)}-${slugPart(model)}`
  for (let attempt = 0; attempt < 80; attempt++) {
    const num = String(Math.floor(100000 + Math.random() * 900000))
    const code = `${prefix}-${num}`
    const clash = await prisma.vehicle.findFirst({
      where: {
        publicCode: code,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    })
    if (!clash) return code
  }
  return `${prefix}-${Date.now().toString().slice(-6)}`
}

async function main() {
  const vehicles = await prisma.vehicle.findMany({
    where: { OR: [{ publicCode: null }, { publicCode: '' }] },
  })
  console.log(`Vehículos sin publicCode: ${vehicles.length}`)
  for (const v of vehicles) {
    const code = await allocateCode(v.brand, v.model, v.id)
    await prisma.vehicle.update({
      where: { id: v.id },
      data: { publicCode: code },
    })
    console.log(`  ${v.id} -> ${code}`)
  }
  console.log('Listo.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
