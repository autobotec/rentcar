import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { translateVehicleTexts } from './translate'

const LOCALES = ['es', 'en', 'fr'] as const

interface FindAllParams {
  locationId?: string
  locationCode?: string
  status?: string
  locale?: string
}

export interface SearchVehiclesParams {
  locationId?: string
  locationCode?: string
  status?: string
  locale?: string
  pickupDatetime?: string
  dropoffDatetime?: string
  transmission?: string
  fuelType?: string
  minPrice?: string
  maxPrice?: string
  capacity?: string
  airConditioning?: string
}

export interface CreateVehicleDto {
  locationId?: string
  brand: string
  model: string
  year?: number
  transmission: string
  fuelType: string
  capacity: number
  doors?: number
  airConditioning?: boolean
  luggage?: number
  basePricePerDay: number
  currency?: string
  status?: string
  description?: string
  engine?: string
  driveType?: string
}

export type UpdateVehicleDto = Partial<CreateVehicleDto>

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllParams) {
    const where: any = {}
    if (params.locationId) where.locationId = params.locationId
    if (params.locationCode) {
      where.location = { code: params.locationCode }
    }
    if (params.status && params.status !== 'all') where.status = params.status

    const vehicles = await this.prisma.vehicle.findMany({
      where,
      include: {
        images: true,
        location: true,
        translations: params.locale && LOCALES.includes(params.locale as any)
          ? { where: { locale: params.locale } }
          : false,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return this.mergeTranslations(vehicles, params.locale)
  }

  /**
   * Búsqueda con filtros y disponibilidad por rango de fechas.
   * Excluye vehículos con reservas que se solapan con [pickup, dropoff].
   */
  async search(params: SearchVehiclesParams) {
    const where: any = {}

    if (params.locationId) where.locationId = params.locationId
    if (params.locationCode) {
      where.location = { code: params.locationCode }
    }
    if (params.status && params.status !== 'all') {
      where.status = params.status
    } else {
      where.status = 'available'
    }

    if (params.transmission) where.transmission = params.transmission
    if (params.fuelType) where.fuelType = params.fuelType
    if (params.capacity) where.capacity = { gte: parseInt(params.capacity, 10) }
    if (params.airConditioning !== undefined && params.airConditioning !== '') {
      where.airConditioning = params.airConditioning === 'true'
    }
    if (params.minPrice) {
      where.basePricePerDay = where.basePricePerDay || {}
      where.basePricePerDay.gte = parseFloat(params.minPrice)
    }
    if (params.maxPrice) {
      where.basePricePerDay = where.basePricePerDay || {}
      where.basePricePerDay.lte = parseFloat(params.maxPrice)
    }

    let excludedVehicleIds: string[] = []
    if (params.pickupDatetime && params.dropoffDatetime) {
      const pickup = new Date(params.pickupDatetime)
      const dropoff = new Date(params.dropoffDatetime)
      if (!isNaN(pickup.getTime()) && !isNaN(dropoff.getTime()) && dropoff > pickup) {
        const overlapping = await this.prisma.reservation.findMany({
          where: {
            status: { in: ['pending', 'confirmed', 'checked_in'] },
            NOT: {
              OR: [
                { dropoffDatetime: { lte: pickup } },
                { pickupDatetime: { gte: dropoff } },
              ],
            },
          },
          select: { vehicleId: true },
        })
        excludedVehicleIds = [...new Set(overlapping.map((r) => r.vehicleId))]
      }
    }

    if (excludedVehicleIds.length > 0) {
      where.id = { notIn: excludedVehicleIds }
    }

    const vehicles = await this.prisma.vehicle.findMany({
      where,
      include: {
        images: true,
        location: true,
        translations: params.locale && LOCALES.includes(params.locale as any)
          ? { where: { locale: params.locale } }
          : false,
      },
      orderBy: [{ basePricePerDay: 'asc' }, { createdAt: 'desc' }],
      take: 50,
    })
    return this.mergeTranslations(vehicles, params.locale)
  }

  private mergeTranslations(vehicles: any[], locale?: string) {
    if (!locale || !LOCALES.includes(locale as any)) return vehicles
    return vehicles.map((v) => {
      const t = Array.isArray(v.translations) ? v.translations[0] : v.translations
      if (t) {
        const { translations, ...rest } = v
        return { ...rest, brand: t.brand, model: t.model, description: t.description }
      }
      const { translations, ...rest } = v
      return rest
    })
  }

  async findOne(id: string, locale?: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: true,
        location: true,
        translations: locale && LOCALES.includes(locale as any)
          ? { where: { locale } }
          : false,
      },
    })

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado')
    }

    const merged = this.mergeTranslations([vehicle], locale)
    return merged[0]
  }

  async create(dto: CreateVehicleDto) {
    if (!dto.brand?.trim() || !dto.model?.trim()) {
      throw new BadRequestException('Marca y modelo son obligatorios')
    }
    const vehicle = await this.prisma.vehicle.create({
      data: {
        locationId: dto.locationId || null,
        brand: dto.brand.trim(),
        model: dto.model.trim(),
        year: dto.year ?? null,
        transmission: dto.transmission || 'automatic',
        fuelType: dto.fuelType || 'gasoline',
        capacity: dto.capacity ?? 5,
        doors: dto.doors ?? null,
        airConditioning: dto.airConditioning ?? true,
        luggage: dto.luggage ?? null,
        basePricePerDay: dto.basePricePerDay ?? 0,
        currency: dto.currency || 'USD',
        status: dto.status || 'available',
        description: dto.description?.trim() || null,
        engine: dto.engine?.trim() || null,
        driveType: dto.driveType?.trim() || null,
      },
      include: { images: true, location: true },
    })
    await this.upsertTranslations(vehicle.id, vehicle.brand, vehicle.model, vehicle.description)
    return vehicle
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const current = await this.prisma.vehicle.findUnique({ where: { id } })
    if (!current) throw new NotFoundException('Vehículo no encontrado')
    const vehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        ...(dto.locationId !== undefined && { locationId: dto.locationId || null }),
        ...(dto.brand !== undefined && { brand: dto.brand.trim() }),
        ...(dto.model !== undefined && { model: dto.model.trim() }),
        ...(dto.year !== undefined && { year: dto.year }),
        ...(dto.transmission !== undefined && { transmission: dto.transmission }),
        ...(dto.fuelType !== undefined && { fuelType: dto.fuelType }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.doors !== undefined && { doors: dto.doors }),
        ...(dto.airConditioning !== undefined && { airConditioning: dto.airConditioning }),
        ...(dto.luggage !== undefined && { luggage: dto.luggage }),
        ...(dto.basePricePerDay !== undefined && { basePricePerDay: dto.basePricePerDay }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
        ...(dto.engine !== undefined && { engine: dto.engine?.trim() || null }),
        ...(dto.driveType !== undefined && { driveType: dto.driveType?.trim() || null }),
      },
      include: { images: true, location: true },
    })
    const needsTranslate =
      dto.brand !== undefined || dto.model !== undefined || dto.description !== undefined
    if (needsTranslate) {
      await this.upsertTranslations(vehicle.id, vehicle.brand, vehicle.model, vehicle.description)
    }
    return vehicle
  }

  private async upsertTranslations(
    vehicleId: string,
    brand: string,
    model: string,
    description: string | null,
  ) {
    const { es, en, fr } = await translateVehicleTexts(brand, model, description)
    for (const [locale, data] of [
      ['es', es],
      ['en', en],
      ['fr', fr],
    ] as const) {
      await this.prisma.vehicleTranslation.upsert({
        where: {
          vehicleId_locale: { vehicleId, locale },
        },
        create: {
          vehicleId,
          locale,
          brand: data.brand,
          model: data.model,
          description: data.description,
        },
        update: {
          brand: data.brand,
          model: data.model,
          description: data.description,
        },
      })
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.vehicle.delete({ where: { id } })
    return { deleted: true }
  }

  async addImage(vehicleId: string, url: string, isPrimary?: boolean) {
    await this.findOne(vehicleId)
    const count = await this.prisma.vehicleImage.count({ where: { vehicleId } })
    if (count >= 10) {
      throw new BadRequestException('Máximo 10 fotos por vehículo.')
    }
    return this.prisma.vehicleImage.create({
      data: {
        vehicleId,
        url,
        isPrimary: isPrimary ?? count === 0,
        orderIndex: count,
      },
    })
  }

  async removeImage(vehicleId: string, imageId: string) {
    const image = await this.prisma.vehicleImage.findFirst({
      where: { id: imageId, vehicleId },
    })
    if (!image) throw new NotFoundException('Imagen no encontrada')
    await this.prisma.vehicleImage.delete({ where: { id: imageId } })
    return { deleted: true }
  }
}


