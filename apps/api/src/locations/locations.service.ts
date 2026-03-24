import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }
}
