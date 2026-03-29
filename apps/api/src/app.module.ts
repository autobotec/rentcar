import { Module } from '@nestjs/common'
import { VehiclesModule } from './vehicles/vehicles.module'
import { ReservationsModule } from './reservations/reservations.module'
import { LocationsModule } from './locations/locations.module'
import { ExtrasModule } from './extras/extras.module'
import { AssistantModule } from './assistant/assistant.module'
import { VehicleMaintenanceModule } from './vehicle-maintenance/vehicle-maintenance.module'

@Module({
  imports: [
    VehiclesModule,
    ReservationsModule,
    LocationsModule,
    ExtrasModule,
    AssistantModule,
    VehicleMaintenanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

