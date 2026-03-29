import { Module } from '@nestjs/common'
import { VehicleMaintenanceController } from './vehicle-maintenance.controller'
import { VehicleMaintenanceService } from './vehicle-maintenance.service'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [VehicleMaintenanceController],
  providers: [VehicleMaintenanceService, PrismaService],
  exports: [VehicleMaintenanceService],
})
export class VehicleMaintenanceModule {}
