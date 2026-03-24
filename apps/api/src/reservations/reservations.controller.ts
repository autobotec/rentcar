import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ReservationsService } from './reservations.service'

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('quote')
  quote(
    @Body()
    body: {
      vehicleId: string
      pickupDatetime: string
      dropoffDatetime: string
      extras?: { extraId: string; quantity: number }[]
    },
  ) {
    return this.reservationsService.quote(body)
  }

  @Post()
  create(
    @Body()
    body: {
      vehicleId: string
      pickupDatetime: string
      dropoffDatetime: string
      customerName: string
      customerEmail: string
      extras?: { extraId: string; quantity: number }[]
    },
  ) {
    return this.reservationsService.create(body)
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll()
  }

  @Get('lookup')
  lookup(
    @Query('email') email: string,
    @Query('reservationNumber') reservationNumber: string,
  ) {
    return this.reservationsService.lookup(email, reservationNumber)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id)
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(id)
  }

  @Post(':id/start-payment')
  startPayment(
    @Param('id') id: string,
    @Body()
    body: {
      provider?: 'stripe' | 'paypal' | 'azul' | 'test'
    },
  ) {
    return this.reservationsService.startPayment({
      reservationId: id,
      provider: body.provider,
    })
  }

  @Post('payments/:paymentId/confirm')
  confirmPayment(@Param('paymentId') paymentId: string) {
    return this.reservationsService.confirmPayment(paymentId)
  }

  @Get('payments/:paymentId')
  getPaymentDetails(@Param('paymentId') paymentId: string) {
    return this.reservationsService.getPaymentDetails(paymentId)
  }

  @Post(':id/checkin')
  checkIn(@Param('id') id: string) {
    return this.reservationsService.checkIn(id)
  }

  @Post(':id/checkout')
  checkOut(@Param('id') id: string) {
    return this.reservationsService.checkOut(id)
  }
}

