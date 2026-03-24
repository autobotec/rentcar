import { Module } from '@nestjs/common'
import { VehiclesModule } from './vehicles/vehicles.module'
import { ReservationsModule } from './reservations/reservations.module'
import { LocationsModule } from './locations/locations.module'
import { ExtrasModule } from './extras/extras.module'

@Module({
  imports: [VehiclesModule, ReservationsModule, LocationsModule, ExtrasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

