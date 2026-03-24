import { Module } from '@nestjs/common'
import { ExtrasController } from './extras.controller'
import { ExtrasService } from './extras.service'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService, PrismaService],
})
export class ExtrasModule {}
