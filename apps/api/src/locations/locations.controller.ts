import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { LocationsService } from './locations.service'

function optNum(v: unknown): number | null {
  if (v == null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function bodyToInput(body: Record<string, unknown>) {
  const lat = body.latitude
  const lng = body.longitude
  return {
    name: String(body.name ?? ''),
    type: body.type != null ? String(body.type) : undefined,
    code:
      body.code != null && String(body.code).trim() !== ''
        ? String(body.code)
        : null,
    country: body.country != null ? String(body.country) : undefined,
    region: body.region != null ? String(body.region) : null,
    address: body.address != null ? String(body.address) : null,
    latitude: optNum(lat),
    longitude: optNum(lng),
    isActive: body.isActive === false ? false : true,
  }
}

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll() {
    return this.locationsService.findAll()
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.locationsService.create(bodyToInput(body))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.locationsService.update(id, bodyToInput(body))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id)
  }
}
