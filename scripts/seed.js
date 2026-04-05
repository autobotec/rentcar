// Seed script - datos reales de producción
// Run with: npm run db:seed

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ─── UBICACIONES ─────────────────────────────────────────────────────────────

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
    console.log('Ubicación PUJ creada.')
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
    console.log('Ubicación SDQ creada.')
  }

  const locationMap = { PUJ: puntaCana, SDQ: santoDomingo }

  // ─── VEHÍCULOS ───────────────────────────────────────────────────────────────
  // Cada vehículo es idempotente por publicCode

  const vehiclesData = [
    {
      publicCode: 'BMW-X5-703299',
      locationCode: 'PUJ',
      brand: 'BMW',
      model: 'X5',
      year: 2024,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 2,
      basePricePerDay: 80.0,
      engine: '3.0L',
      driveType: '4x4',
      description:
        'BMW X5 xDrive40i (Generación G05)\nLa BMW X5 es la combinación perfecta de deportividad, lujo y tecnología de vanguardia. Es ampliamente considerada como la SUV que mejor se conduce en su categoría, ofreciendo una agilidad sorprendente para su tamaño.',
      imageUrl: 'http://localhost:3000/uploads/1773705705461-sscebl15c39.png',
    },
    {
      publicCode: 'FORD-EXPLORER-831946',
      locationCode: 'SDQ',
      brand: 'FORD',
      model: 'EXPLORER',
      year: 2018,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 80.0,
      engine: '3.5L',
      driveType: '4x4',
      description:
        'La Ford Explorer 2018 es un referente en el segmento de las SUVs medianas, especialmente valorada por las familias que necesitan espacio y potencia.',
      imageUrl: 'http://localhost:3000/uploads/1773710015552-8sfdoj5rzr.png',
    },
    {
      publicCode: 'JEEP-WRANGLER-UNLIMITED-825496',
      locationCode: 'PUJ',
      brand: 'JEEP',
      model: 'WRANGLER UNLIMITED',
      year: 2022,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 2,
      basePricePerDay: 45.0,
      engine: '3.0L',
      driveType: '4x4',
      description:
        'Es el balance perfecto entre aventura extrema y comodidad. A diferencia del modelo clásico, esta versión de 4 puertas ofrece un espacio interior generoso para 5 pasajeros y un maletero real para equipaje, sin sacrificar la esencia todoterreno de Jeep.',
      imageUrl: 'http://localhost:3000/uploads/1773706009739-oshwzw6s06b.png',
    },
    {
      publicCode: 'HONDA-CR-V-896890',
      locationCode: 'PUJ',
      brand: 'HONDA',
      model: 'CR-V',
      year: 2020,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 75.0,
      engine: '2.0L',
      driveType: null,
      description:
        'Se trata de una Honda CR-V, es muy eficiente para su tamaño, logrando un promedio de 12-14 km/l en uso mixto. Es considerada la reina de su segmento en cuanto a capacidad de carga en el baúl y espacio para las piernas en la segunda fila.',
      imageUrl: 'http://localhost:3000/uploads/1773706204297-qfphfph9zwa.jpeg',
    },
    {
      publicCode: 'HYUNDAI-CRETA-981558',
      locationCode: 'SDQ',
      brand: 'HYUNDAI',
      model: 'CRETA',
      year: 2019,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 55.0,
      engine: '2.0L',
      driveType: '4x2',
      description:
        'La Hyundai Tucson es una de las SUVs más equilibradas y exitosas del mercado por su confiabilidad y diseño fluido.',
      imageUrl: 'http://localhost:3000/uploads/1773707236745-fext2o33xl8.png',
    },
    {
      publicCode: 'HYUNDAI-SONATA-484789',
      locationCode: 'SDQ',
      brand: 'HYUNDAI',
      model: 'SONATA',
      year: 2019,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 55.0,
      engine: '2.0L',
      driveType: null,
      description:
        'Específicamente, parece ser un modelo de la séptima generación (LF). Se trata de un sedán de tamaño mediano conocido por su diseño elegante y su interior espacioso.',
      imageUrl: 'http://localhost:3000/uploads/1773706664511-hd2tt21a62b.jpeg',
    },
    {
      publicCode: 'FORD-ESCAPE-735956',
      locationCode: 'SDQ',
      brand: 'FORD',
      model: 'ESCAPE',
      year: 2022,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 59.98,
      engine: '2.0L',
      driveType: '4x2',
      description:
        'La Ford Escape 2020 es una SUV compacta que equilibra perfectamente la tecnología moderna con un manejo ágil. Es ideal tanto para la ciudad como para viajes por carretera gracias a su suspensión firme y dirección precisa.',
      imageUrl: 'http://localhost:3000/uploads/1774127369286-hxpx3v0ba1t.png',
    },
    {
      publicCode: 'FORD-ESCAPE-997597',
      locationCode: 'SDQ',
      brand: 'FORD',
      model: 'ESCAPE',
      year: 2020,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 55.0,
      engine: '2.0L',
      driveType: '4x2',
      description:
        'SUV compacta color gris oscuro de Ford, con diseño moderno, buena altura al suelo y capacidad para 5 pasajeros. Ideal para uso urbano y viajes, ofreciendo comodidad, espacio y eficiencia.',
      imageUrl: 'http://localhost:3000/uploads/1773888470546-tdlqzy5zizf.jpeg',
    },
    {
      publicCode: 'KIA-OPTIMA-304806',
      locationCode: 'SDQ',
      brand: 'KIA',
      model: 'OPTIMA',
      year: 2020,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 55.0,
      engine: null,
      driveType: null,
      description:
        'El Kia Optima es un sedán mediano que combina un diseño deportivo con un interior sorprendentemente espacioso y tecnológico. Es el vehículo perfecto para quienes buscan elegancia y confort sin las complicaciones de una SUV.',
      imageUrl: 'http://localhost:3000/uploads/1773706874594-kjo27jxr7o9.jpeg',
    },
    {
      publicCode: 'PORSCHE-CAYENNE-591895',
      locationCode: 'SDQ',
      brand: 'PORSCHE',
      model: 'CAYENNE',
      year: 2023,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 3,
      basePricePerDay: 75.0,
      engine: '4.0L',
      driveType: '4x4',
      description:
        'Porsche Cayenne S (V8 Edition)\nLa Porsche Cayenne S redefine lo que debe ser una SUV de lujo, combinando el ADN de un coche deportivo con la versatilidad de un vehículo familiar. Es la opción definitiva para quienes no están dispuestos a sacrificar potencia por espacio.',
      imageUrl: 'http://localhost:3000/uploads/1773705906366-gq6tl31645r.png',
    },
    {
      publicCode: 'CHEVROLET-SILVERADO-638594',
      locationCode: 'SDQ',
      brand: 'CHEVROLET',
      model: 'SILVERADO',
      year: 2020,
      transmission: 'automatic',
      fuelType: 'gasoline',
      capacity: 5,
      doors: 4,
      airConditioning: true,
      luggage: 1,
      basePricePerDay: 80.0,
      engine: '3.5L',
      driveType: null,
      description:
        'Esta Chevrolet Silverado (generación 2020) es una de las camionetas de tamaño completo (full-size) más imponentes y capaces.',
      imageUrl: 'http://localhost:3000/uploads/1773706492973-z8gazuxq5t.png',
    },
  ]

  for (const v of vehiclesData) {
    const existing = await prisma.vehicle.findFirst({ where: { publicCode: v.publicCode } })
    if (existing) {
      console.log(`Vehículo ya existe: ${v.brand} ${v.model} (${v.publicCode})`)
      continue
    }

    const location = locationMap[v.locationCode]
    const vehicle = await prisma.vehicle.create({
      data: {
        publicCode: v.publicCode,
        locationId: location.id,
        brand: v.brand,
        model: v.model,
        year: v.year,
        transmission: v.transmission,
        fuelType: v.fuelType,
        capacity: v.capacity,
        doors: v.doors,
        airConditioning: v.airConditioning,
        luggage: v.luggage,
        basePricePerDay: v.basePricePerDay,
        currency: 'USD',
        status: 'available',
        engine: v.engine,
        driveType: v.driveType,
        description: v.description,
      },
    })

    // Imagen principal
    if (v.imageUrl) {
      await prisma.vehicleImage.create({
        data: {
          vehicleId: vehicle.id,
          url: v.imageUrl,
          isPrimary: true,
          orderIndex: 0,
        },
      })
    }

    console.log(`Vehículo creado: ${v.brand} ${v.model} ${v.year}`)
  }

  // ─── EXTRAS ──────────────────────────────────────────────────────────────────

  const extras = [
    { name: 'GPS', description: 'Navegador GPS', pricePerDay: 5.0 },
    { name: 'Silla de bebé', description: 'Silla infantil', pricePerDay: 8.0 },
    { name: 'Conductor adicional', description: 'Segundo conductor autorizado', pricePerDay: 15.0 },
  ]

  for (const extra of extras) {
    const existing = await prisma.extra.findFirst({ where: { name: extra.name } })
    if (!existing) {
      await prisma.extra.create({
        data: {
          name: extra.name,
          description: extra.description,
          pricePerDay: extra.pricePerDay,
          priceType: 'per_day',
          currency: 'USD',
          isActive: true,
        },
      })
      console.log(`Extra creado: ${extra.name}`)
    }
  }

  console.log('✅ Seed completado.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
