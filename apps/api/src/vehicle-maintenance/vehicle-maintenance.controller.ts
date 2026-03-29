import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import {
  MAINTENANCE_CATEGORIES,
  VehicleMaintenanceService,
  type CreateMaintenanceDto,
} from './vehicle-maintenance.service'

@Controller('vehicle-maintenance')
export class VehicleMaintenanceController {
  constructor(private readonly service: VehicleMaintenanceService) {}

  /** Resumen por vehículo para el dashboard admin */
  @Get('dashboard')
  dashboard() {
    return this.service.dashboardSummary()
  }

  @Get('categories')
  categories() {
    return { categories: [...MAINTENANCE_CATEGORIES] }
  }

  @Get('vehicle/:vehicleId')
  list(@Param('vehicleId') vehicleId: string) {
    return this.service.listForVehicle(vehicleId)
  }

  @Post('vehicle/:vehicleId')
  create(@Param('vehicleId') vehicleId: string, @Body() body: CreateMaintenanceDto) {
    return this.service.create(vehicleId, body)
  }

  @Patch('vehicle/:vehicleId/:recordId')
  update(
    @Param('vehicleId') vehicleId: string,
    @Param('recordId') recordId: string,
    @Body() body: Partial<CreateMaintenanceDto>,
  ) {
    return this.service.update(vehicleId, recordId, body)
  }

  @Delete('vehicle/:vehicleId/:recordId')
  remove(@Param('vehicleId') vehicleId: string, @Param('recordId') recordId: string) {
    return this.service.remove(vehicleId, recordId)
  }
}
