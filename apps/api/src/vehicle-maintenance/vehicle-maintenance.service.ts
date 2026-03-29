import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

export const MAINTENANCE_CATEGORIES = [
  'oil_change',
  'brakes',
  'cleaning',
  'parts',
  'taxes',
  'insurance',
  'tires',
  'battery',
  'inspection',
  'other',
] as const

export type MaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number]

export type CreateMaintenanceDto = {
  performedAt?: string
  mileageKm?: number | null
  category: string
  title?: string | null
  description?: string | null
  amount?: number
  currency?: string
}

@Injectable()
export class VehicleMaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveVehicleId(idOrCode: string): Promise<string> {
    const v = await this.prisma.vehicle.findFirst({
      where: { OR: [{ id: idOrCode }, { publicCode: idOrCode }] },
      select: { id: true },
    })
    if (!v) throw new NotFoundException('Vehículo no encontrado')
    return v.id
  }

  private assertCategory(cat: string): MaintenanceCategory {
    const c = cat?.trim()
    if (!MAINTENANCE_CATEGORIES.includes(c as MaintenanceCategory)) {
      throw new BadRequestException(
        `Categoría inválida. Use: ${MAINTENANCE_CATEGORIES.join(', ')}`,
      )
    }
    return c as MaintenanceCategory
  }

  async dashboardSummary() {
    const vehicles = await this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        brand: true,
        model: true,
        publicCode: true,
        maintenance: {
          orderBy: { performedAt: 'desc' },
          select: {
            mileageKm: true,
            amount: true,
            currency: true,
            performedAt: true,
            category: true,
          },
        },
      },
    })

    return vehicles.map((v) => {
      const m = v.maintenance
      const mileages = m.map((r) => r.mileageKm).filter((x): x is number => x != null)
      const lastMileageKm = mileages.length > 0 ? Math.max(...mileages) : null
      const totalsByCurrency: Record<string, number> = {}
      for (const r of m) {
        const cur = r.currency || 'USD'
        totalsByCurrency[cur] = (totalsByCurrency[cur] || 0) + r.amount
      }
      return {
        vehicleId: v.id,
        publicCode: v.publicCode,
        label: `${v.brand} ${v.model}`,
        recordCount: m.length,
        lastMileageKm,
        totalsByCurrency,
        lastPerformedAt: m[0]?.performedAt ?? null,
        lastCategory: m[0]?.category ?? null,
      }
    })
  }

  async listForVehicle(vehicleIdOrCode: string) {
    const vehicleId = await this.resolveVehicleId(vehicleIdOrCode)
    return this.prisma.vehicleMaintenanceRecord.findMany({
      where: { vehicleId },
      orderBy: { performedAt: 'desc' },
    })
  }

  async create(vehicleIdOrCode: string, dto: CreateMaintenanceDto) {
    const vehicleId = await this.resolveVehicleId(vehicleIdOrCode)
    const category = this.assertCategory(dto.category)
    const performedAt = dto.performedAt ? new Date(dto.performedAt) : new Date()
    if (isNaN(performedAt.getTime())) {
      throw new BadRequestException('Fecha inválida')
    }
    const amount = dto.amount ?? 0
    if (amount < 0) throw new BadRequestException('El monto no puede ser negativo')

    return this.prisma.vehicleMaintenanceRecord.create({
      data: {
        vehicleId,
        performedAt,
        mileageKm: dto.mileageKm ?? null,
        category,
        title: dto.title?.trim() || null,
        description: dto.description?.trim() || null,
        amount,
        currency: dto.currency?.trim() || 'USD',
      },
    })
  }

  async update(
    vehicleIdOrCode: string,
    recordId: string,
    dto: Partial<CreateMaintenanceDto>,
  ) {
    const vehicleId = await this.resolveVehicleId(vehicleIdOrCode)
    const existing = await this.prisma.vehicleMaintenanceRecord.findFirst({
      where: { id: recordId, vehicleId },
    })
    if (!existing) throw new NotFoundException('Registro no encontrado')

    const data: Prisma.VehicleMaintenanceRecordUpdateInput = {}
    if (dto.performedAt !== undefined) {
      const d = new Date(dto.performedAt)
      if (isNaN(d.getTime())) throw new BadRequestException('Fecha inválida')
      data.performedAt = d
    }
    if (dto.mileageKm !== undefined) data.mileageKm = dto.mileageKm
    if (dto.category !== undefined) data.category = this.assertCategory(dto.category)
    if (dto.title !== undefined) data.title = dto.title?.trim() || null
    if (dto.description !== undefined) data.description = dto.description?.trim() || null
    if (dto.amount !== undefined) {
      if (dto.amount < 0) throw new BadRequestException('El monto no puede ser negativo')
      data.amount = dto.amount
    }
    if (dto.currency !== undefined) data.currency = dto.currency?.trim() || 'USD'

    return this.prisma.vehicleMaintenanceRecord.update({
      where: { id: recordId },
      data,
    })
  }

  async remove(vehicleIdOrCode: string, recordId: string) {
    const vehicleId = await this.resolveVehicleId(vehicleIdOrCode)
    const existing = await this.prisma.vehicleMaintenanceRecord.findFirst({
      where: { id: recordId, vehicleId },
    })
    if (!existing) throw new NotFoundException('Registro no encontrado')
    await this.prisma.vehicleMaintenanceRecord.delete({ where: { id: recordId } })
    return { deleted: true }
  }
}
