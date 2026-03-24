import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { VehiclesService } from './vehicles.service'

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findOrSearch(
    @Query('locationId') locationId?: string,
    @Query('locationCode') locationCode?: string,
    @Query('status') status?: string,
    @Query('locale') locale?: string,
    @Query('pickupDatetime') pickupDatetime?: string,
    @Query('dropoffDatetime') dropoffDatetime?: string,
    @Query('transmission') transmission?: string,
    @Query('fuelType') fuelType?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('capacity') capacity?: string,
    @Query('airConditioning') airConditioning?: string,
  ) {
    const useSearch =
      pickupDatetime ||
      dropoffDatetime ||
      transmission ||
      fuelType ||
      minPrice ||
      maxPrice ||
      capacity ||
      airConditioning !== undefined
    if (useSearch) {
      return this.vehiclesService.search({
        locationId,
        locationCode,
        status: status ?? 'available',
        locale,
        pickupDatetime,
        dropoffDatetime,
        transmission,
        fuelType,
        minPrice,
        maxPrice,
        capacity,
        airConditioning,
      })
    }
    return this.vehiclesService.findAll({
      locationId,
      locationCode,
      status: status ?? 'available',
      locale,
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.vehiclesService.findOne(id, locale)
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.vehiclesService.create(body as any)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.vehiclesService.update(id, body as any)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id)
  }

  @Post(':id/images')
  addImage(
    @Param('id') id: string,
    @Body() body: { url: string; isPrimary?: boolean },
  ) {
    return this.vehiclesService.addImage(id, body.url, body.isPrimary)
  }

  @Delete(':id/images/:imageId')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.vehiclesService.removeImage(id, imageId)
  }
}


