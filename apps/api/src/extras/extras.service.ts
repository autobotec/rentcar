import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ExtrasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.extra.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }
}
