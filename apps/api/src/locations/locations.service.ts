import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'

export type CreateLocationInput = {
  name: string
  type?: string
  code?: string | null
  country?: string
  region?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  isActive?: boolean
}

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const loc = await this.prisma.location.findFirst({
      where: { id, isActive: true },
    })
    if (!loc) {
      throw new NotFoundException('Ubicación no encontrada')
    }
    return loc
  }

  private normalizeCreateInput(input: CreateLocationInput) {
    const name = input.name?.trim()
    if (!name) {
      throw new BadRequestException('El nombre es obligatorio')
    }
    const type = (input.type ?? 'branch').trim() || 'branch'
    const codeRaw = input.code?.trim()
    const code = codeRaw ? codeRaw : null
    const region = input.region?.trim() || null
    const address = input.address?.trim() || null
    const country = input.country?.trim() || 'Dominican Republic'
    return {
      name,
      type,
      code,
      country,
      region,
      address,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      isActive: input.isActive ?? true,
    }
  }

  async create(input: CreateLocationInput) {
    const data = this.normalizeCreateInput(input)

    try {
      return await this.prisma.location.create({
        data,
      })
    } catch (e: unknown) {
      const code =
        e &&
        typeof e === 'object' &&
        'code' in e &&
        typeof (e as { code: unknown }).code === 'string'
          ? (e as { code: string }).code
          : null
      if (code === 'P2002') {
        throw new BadRequestException(
          'Ya existe una ubicación con ese código',
        )
      }
      throw e
    }
  }

  async update(id: string, input: CreateLocationInput) {
    await this.findOne(id)
    const data = this.normalizeCreateInput({
      ...input,
      isActive: true,
    })

    try {
      return await this.prisma.location.update({
        where: { id },
        data,
      })
    } catch (e: unknown) {
      const code =
        e &&
        typeof e === 'object' &&
        'code' in e &&
        typeof (e as { code: unknown }).code === 'string'
          ? (e as { code: string }).code
          : null
      if (code === 'P2002') {
        throw new BadRequestException(
          'Ya existe una ubicación con ese código',
        )
      }
      throw e
    }
  }

  /** Desactiva la ubicación (no borra filas; desaparece de listados públicos). */
  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.location.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
