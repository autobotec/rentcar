// Simple seed script for dev using SQLite
// Run with: npm run db:seed

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Idempotent-style seed: find or create
  let puntaCana = await prisma.location.findFirst({ where: { code: 'PUJ' } })
  if (!puntaCana) {
    puntaCana = await prisma.location.create({
      data: {
        name: 'Aeropuerto Internacional de Punta Cana',
        type: 'airport',
        code: 'PUJ',
        country: 'Dominican Republic',
        region: 'Punta Cana',
        isActive: true,
      },
    })
  }

  let santoDomingo = await prisma.location.findFirst({ where: { code: 'SDQ' } })
  if (!santoDomingo) {
    santoDomingo = await prisma.location.create({
      data: {
        name: 'Aeropuerto Internacional Las Américas',
        type: 'airport',
        code: 'SDQ',
        country: 'Dominican Republic',
        region: 'Santo Domingo',
        isActive: true,
      },
    })
  }

  // Basic vehicles
  const existingVehicles = await prisma.vehicle.count()
  if (existingVehicles === 0) {
    await prisma.vehicle.create({
      data: {
        locationId: puntaCana.id,
        brand: 'Hyundai',
        model: 'Accent',
        year: 2022,
        transmission: 'automatic',
        fuelType: 'gasoline',
        capacity: 5,
        doors: 4,
        airConditioning: true,
        luggage: 2,
        basePricePerDay: 45,
        currency: 'USD',
        status: 'available',
        description: 'Sedán compacto automático, ideal para ciudad y aeropuerto PUJ.',
      },
    })
    await prisma.vehicle.create({
      data: {
        locationId: santoDomingo.id,
        brand: 'Kia',
        model: 'Sportage',
        year: 2023,
        transmission: 'automatic',
        fuelType: 'gasoline',
        capacity: 5,
        doors: 4,
        airConditioning: true,
        luggage: 3,
        basePricePerDay: 75,
        currency: 'USD',
        status: 'available',
        description: 'SUV cómoda para familias, perfecta para recorrer Santo Domingo y alrededores.',
      },
    })
    await prisma.vehicle.create({
      data: {
        locationId: puntaCana.id,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        transmission: 'automatic',
        fuelType: 'gasoline',
        capacity: 5,
        doors: 4,
        airConditioning: true,
        luggage: 2,
        basePricePerDay: 55,
        currency: 'USD',
        status: 'available',
        description: 'Sedán confiable y económico, ideal para desplazamientos en Punta Cana y alrededores.',
      },
    })
  }

  // Asegurar que el tercer coche (Toyota Corolla) exista aunque el seed se haya ejecutado antes con solo 2
  let toyotaCorolla = await prisma.vehicle.findFirst({
    where: { brand: 'Toyota', model: 'Corolla' },
  })
  if (!toyotaCorolla) {
    toyotaCorolla = await prisma.vehicle.create({
      data: {
        locationId: puntaCana.id,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        transmission: 'automatic',
        fuelType: 'gasoline',
        capacity: 5,
        doors: 4,
        airConditioning: true,
        luggage: 2,
        basePricePerDay: 55,
        currency: 'USD',
        status: 'available',
        description: 'Sedán confiable y económico, ideal para desplazamientos en Punta Cana y alrededores.',
      },
    })
    console.log('Toyota Corolla creado.')
  }

  // Ensure demo images for vehicles (idempotent)
  const hyundaiAccent = await prisma.vehicle.findFirst({
    where: { brand: 'Hyundai', model: 'Accent' },
  })
  if (hyundaiAccent) {
    const count = await prisma.vehicleImage.count({ where: { vehicleId: hyundaiAccent.id } })
    if (count === 0) {
      await prisma.vehicleImage.create({
        data: {
          vehicleId: hyundaiAccent.id,
          url: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
          isPrimary: true,
          orderIndex: 0,
        },
      })
    }
  }

  const kiaSportage = await prisma.vehicle.findFirst({
    where: { brand: 'Kia', model: 'Sportage' },
  })
  if (kiaSportage) {
    const count = await prisma.vehicleImage.count({ where: { vehicleId: kiaSportage.id } })
    if (count === 0) {
      await prisma.vehicleImage.create({
        data: {
          vehicleId: kiaSportage.id,
          url: 'https://images.pexels.com/photos/376729/pexels-photo-376729.jpeg',
          isPrimary: true,
          orderIndex: 0,
        },
      })
    }
  }

  if (toyotaCorolla) {
    const count = await prisma.vehicleImage.count({ where: { vehicleId: toyotaCorolla.id } })
    if (count === 0) {
      await prisma.vehicleImage.create({
        data: {
          vehicleId: toyotaCorolla.id,
          url: 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg',
          isPrimary: true,
          orderIndex: 0,
        },
      })
    }
  }

  // Extras (idempotent)
  const extraNames = ['GPS', 'Silla de bebé', 'Conductor adicional']
  for (const name of extraNames) {
    const existing = await prisma.extra.findFirst({ where: { name } })
    if (!existing) {
      const isGps = name === 'GPS'
      const isSilla = name === 'Silla de bebé'
      await prisma.extra.create({
        data: {
          name,
          description: isGps ? 'Navegador GPS' : isSilla ? 'Silla infantil' : 'Segundo conductor autorizado',
          pricePerDay: isGps ? 5 : isSilla ? 8 : 15,
          priceType: 'per_day',
          currency: 'USD',
          isActive: true,
        },
      })
    }
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

