import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import Stripe from 'stripe'
import * as paypal from '@paypal/checkout-server-sdk'

type QuoteInput = {
  vehicleId: string
  pickupDatetime: string
  dropoffDatetime: string
  extras?: { extraId: string; quantity: number }[]
}

type CreateReservationInput = QuoteInput & {
  customerName: string
  customerEmail: string
}

type StartPaymentInput = {
  reservationId: string
  provider?: 'stripe' | 'paypal' | 'azul' | 'test'
}

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Acepta UUID interno o publicCode (MARCA-MODELO-######). */
  private async findVehicleByIdOrPublicCode(vehicleIdOrCode: string, withLocation: boolean) {
    return this.prisma.vehicle.findFirst({
      where: {
        OR: [{ id: vehicleIdOrCode }, { publicCode: vehicleIdOrCode }],
      },
      ...(withLocation ? { include: { location: true } } : {}),
    })
  }

  private getNights(pickup: Date, dropoff: Date): number {
    const ms = dropoff.getTime() - pickup.getTime()
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    // Mínimo 2 días de reserva
    return Math.max(days, 2)
  }

  private async ensureAvailability(vehicleId: string, pickup: Date, dropoff: Date) {
    const overlapping = await this.prisma.reservation.count({
      where: {
        vehicleId,
        // Solo reservas confirmadas/en curso bloquean el vehículo.
        status: { in: ['confirmed', 'checked_in'] },
        NOT: {
          OR: [
            { dropoffDatetime: { lte: pickup } },
            { pickupDatetime: { gte: dropoff } },
          ],
        },
      },
    })
    if (overlapping > 0) {
      throw new BadRequestException('El vehículo no está disponible en ese rango de fechas.')
    }
  }

  async quote(input: QuoteInput) {
    const vehicle = await this.findVehicleByIdOrPublicCode(input.vehicleId, false)
    if (!vehicle) {
      throw new BadRequestException('Vehículo no encontrado')
    }

    const pickup = new Date(input.pickupDatetime)
    const dropoff = new Date(input.dropoffDatetime)
    if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime()) || dropoff <= pickup) {
      throw new BadRequestException('Fechas inválidas')
    }

    const nights = this.getNights(pickup, dropoff)
    if (nights < 2) {
      throw new BadRequestException('La reserva mínima es de dos días.')
    }
    const base = nights * vehicle.basePricePerDay
    const extrasBreakdown: { extraId: string; name: string; quantity: number; price: number }[] = []
    let extrasTotal = 0

    if (input.extras?.length) {
      for (const item of input.extras) {
        const extra = await this.prisma.extra.findFirst({
          where: { id: item.extraId, isActive: true },
        })
        if (!extra || item.quantity < 1) continue
        const qty = Math.min(item.quantity, 10)
        const pricePerUnit = extra.pricePerDay ?? 0
        const price =
          extra.priceType === 'fixed'
            ? pricePerUnit * qty
            : pricePerUnit * nights * qty
        extrasBreakdown.push({
          extraId: extra.id,
          name: extra.name,
          quantity: qty,
          price,
        })
        extrasTotal += price
      }
    }

    return {
      vehicleId: vehicle.id,
      nights,
      currency: vehicle.currency,
      subtotal: base,
      extrasBreakdown,
      extrasTotal,
      totalPrice: base + extrasTotal,
    }
  }

  async create(input: CreateReservationInput) {
    const vehicle = await this.findVehicleByIdOrPublicCode(input.vehicleId, true)
    if (!vehicle || !vehicle.locationId) {
      throw new BadRequestException('Vehículo o ubicación inválida')
    }

    const pickup = new Date(input.pickupDatetime)
    const dropoff = new Date(input.dropoffDatetime)
    if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime()) || dropoff <= pickup) {
      throw new BadRequestException('Fechas inválidas')
    }

    await this.ensureAvailability(vehicle.id, pickup, dropoff)

    const nights = this.getNights(pickup, dropoff)
    let totalPrice = nights * vehicle.basePricePerDay
    const extrasToCreate: { extraId: string; quantity: number; price: number; currency: string }[] = []

    if (input.extras?.length) {
      for (const item of input.extras) {
        const extra = await this.prisma.extra.findFirst({
          where: { id: item.extraId, isActive: true },
        })
        if (!extra || item.quantity < 1) continue
        const qty = Math.min(item.quantity, 10)
        const pricePerUnit = extra.pricePerDay ?? 0
        const price =
          extra.priceType === 'fixed'
            ? pricePerUnit * qty
            : pricePerUnit * nights * qty
        extrasToCreate.push({
          extraId: extra.id,
          quantity: qty,
          price,
          currency: extra.currency,
        })
        totalPrice += price
      }
    }

    const email = input.customerEmail.toLowerCase().trim()
    const name = input.customerName.trim()

    const user = await this.prisma.user.upsert({
      where: { email },
      update: { name: name || undefined },
      create: {
        email,
        name: name || null,
        role: 'customer',
      },
    })

    const reservationNumber = `RC-${Date.now().toString(36).toUpperCase().slice(-6)}`

    const reservation = await this.prisma.reservation.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        pickupLocationId: vehicle.locationId,
        dropoffLocationId: vehicle.locationId,
        pickupDatetime: pickup,
        dropoffDatetime: dropoff,
        status: 'pending',
        totalPrice,
        currency: vehicle.currency,
        paymentStatus: 'pending',
        paymentMode: 'full',
        reservationNumber,
      },
    })

    for (const ex of extrasToCreate) {
      await this.prisma.reservationExtra.create({
        data: {
          reservationId: reservation.id,
          extraId: ex.extraId,
          quantity: ex.quantity,
          price: ex.price,
          currency: ex.currency,
        },
      })
    }

    return {
      id: reservation.id,
      reservationNumber: reservation.reservationNumber,
      status: reservation.status,
      totalPrice: reservation.totalPrice,
      currency: reservation.currency,
    }
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      orderBy: { pickupDatetime: 'desc' },
      include: {
        vehicle: { include: { location: true } },
        user: true,
        pickupLocation: true,
        dropoffLocation: true,
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        vehicle: { include: { location: true, images: true } },
        user: true,
        pickupLocation: true,
        dropoffLocation: true,
        extras: { include: { extra: true } },
      },
    })
  }

  async startPayment(input: StartPaymentInput) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: input.reservationId },
      include: { vehicle: true },
    })

    if (!reservation) {
      throw new BadRequestException('Reserva no encontrada')
    }

    if (reservation.paymentStatus === 'paid') {
      throw new BadRequestException('La reserva ya está pagada')
    }

    const provider = input.provider ?? 'test'

    // Cobrar siempre el valor del primer día (depósito).
    const amount = reservation.vehicle?.basePricePerDay ?? reservation.totalPrice
    const currency = reservation.currency

    if (provider === 'stripe') {
      const secret = process.env.STRIPE_SECRET_KEY
      if (!secret) throw new BadRequestException('Stripe no está configurado (STRIPE_SECRET_KEY faltante)')
      const stripe = new Stripe(secret)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: { reservationId: reservation.id, paymentType: 'deposit' },
      })

      const payment = await this.prisma.payment.create({
        data: {
          reservationId: reservation.id,
          provider,
          providerPaymentId: paymentIntent.id,
          amount,
          currency,
          status: 'pending',
          type: 'deposit',
        },
      })

      return {
        paymentId: payment.id,
        provider,
        amount: payment.amount,
        currency: payment.currency,
        clientSecret: paymentIntent.client_secret,
      }
    }

    if (provider === 'paypal') {
      const clientId = process.env.PAYPAL_CLIENT_ID
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET
      if (!clientId || !clientSecret) {
        throw new BadRequestException('PayPal no está configurado (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET faltantes)')
      }

      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
      const client = new paypal.core.PayPalHttpClient(environment)

      const request = new paypal.orders.OrdersCreateRequest()
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
      })

      const order = await client.execute(request)
      const orderId = order?.result?.id as string
      const approvalUrl = order?.result?.links?.find((l: any) => l.rel === 'approve')?.href as string | undefined

      if (!orderId) throw new BadRequestException('No se pudo crear la orden de PayPal')

      const payment = await this.prisma.payment.create({
        data: {
          reservationId: reservation.id,
          provider,
          providerPaymentId: orderId,
          amount,
          currency,
          status: 'pending',
          type: 'deposit',
        },
      })

      return {
        paymentId: payment.id,
        provider,
        amount: payment.amount,
        currency: payment.currency,
        orderId,
        approvalUrl,
      }
    }

    // Fallback modo prueba (test)
    const payment = await this.prisma.payment.create({
      data: {
        reservationId: reservation.id,
        provider,
        providerPaymentId: `test_${Date.now().toString(36)}`,
        amount,
        currency,
        status: 'pending',
        type: 'deposit',
      },
    })

    return {
      paymentId: payment.id,
      provider: payment.provider,
      amount: payment.amount,
      currency: payment.currency,
    }
  }

  async getPaymentDetails(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { reservation: { include: { vehicle: true } } },
    })
    if (!payment) throw new BadRequestException('Pago no encontrado')

    if (payment.provider === 'stripe') {
      const secret = process.env.STRIPE_SECRET_KEY
      if (!secret) throw new BadRequestException('Stripe no está configurado')
      const stripe = new Stripe(secret)
      const pi = await stripe.paymentIntents.retrieve(payment.providerPaymentId)
      return {
        paymentId: payment.id,
        provider: payment.provider,
        amount: payment.amount,
        currency: payment.currency,
        providerPaymentId: payment.providerPaymentId,
        clientSecret: (pi as any).client_secret,
      }
    }

    if (payment.provider === 'paypal') {
      return {
        paymentId: payment.id,
        provider: payment.provider,
        amount: payment.amount,
        currency: payment.currency,
        providerPaymentId: payment.providerPaymentId,
        orderId: payment.providerPaymentId,
      }
    }

    return {
      paymentId: payment.id,
      provider: payment.provider,
      amount: payment.amount,
      currency: payment.currency,
      providerPaymentId: payment.providerPaymentId,
    }
  }

  async confirmPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      throw new BadRequestException('Pago no encontrado')
    }

    if (payment.status === 'succeeded') {
      return payment
    }

    if (payment.provider === 'stripe') {
      const secret = process.env.STRIPE_SECRET_KEY
      if (!secret) throw new BadRequestException('Stripe no está configurado')
      const stripe = new Stripe(secret)
      const pi = await stripe.paymentIntents.retrieve(payment.providerPaymentId)
      if ((pi as any).status !== 'succeeded') {
        throw new BadRequestException('El pago con Stripe aún no está confirmado')
      }
    }

    if (payment.provider === 'paypal') {
      const clientId = process.env.PAYPAL_CLIENT_ID
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET
      if (!clientId || !clientSecret) throw new BadRequestException('PayPal no está configurado')

      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
      const client = new paypal.core.PayPalHttpClient(environment)
      const request = new paypal.orders.OrdersGetRequest(payment.providerPaymentId)
      const order = await client.execute(request)
      const orderStatus = order?.result?.status as string | undefined
      if (orderStatus !== 'COMPLETED') {
        throw new BadRequestException('El pago con PayPal aún no está completado')
      }
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'succeeded',
      },
    })

    await this.prisma.reservation.update({
      where: { id: payment.reservationId },
      data: {
        paymentStatus: 'paid',
        status: 'confirmed',
      },
    })

    return updatedPayment
  }

  async checkIn(reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { vehicle: true },
    })

    if (!reservation) {
      throw new BadRequestException('Reserva no encontrada')
    }

    if (!['confirmed', 'pending'].includes(reservation.status)) {
      throw new BadRequestException('La reserva no puede hacer check-in en el estado actual')
    }

    const updatedReservation = await this.prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'checked_in',
        checkinAt: new Date(),
      },
    })

    await this.prisma.vehicle.update({
      where: { id: reservation.vehicleId },
      data: {
        status: 'reserved',
      },
    })

    return updatedReservation
  }

  async checkOut(reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    })

    if (!reservation) {
      throw new BadRequestException('Reserva no encontrada')
    }

    if (!['checked_in', 'confirmed'].includes(reservation.status)) {
      throw new BadRequestException('La reserva no puede hacer check-out en el estado actual')
    }

    const updatedReservation = await this.prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'completed',
        checkoutAt: new Date(),
      },
    })

    await this.prisma.vehicle.update({
      where: { id: reservation.vehicleId },
      data: {
        status: 'available',
      },
    })

    return updatedReservation
  }

  async cancel(reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    })
    if (!reservation) {
      throw new BadRequestException('Reserva no encontrada')
    }
    if (reservation.paymentStatus === 'paid') {
      throw new BadRequestException('No se puede cancelar una reserva ya pagada')
    }
    if (!['pending', 'confirmed'].includes(reservation.status)) {
      throw new BadRequestException('Esta reserva no puede ser cancelada')
    }
    const updated = await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'canceled' },
      include: {
        vehicle: { include: { location: true } },
        user: true,
      },
    })

    // Liberar vehículo si estaba bloqueado para esta reserva
    if (updated.vehicleId) {
      await this.prisma.vehicle.update({
        where: { id: updated.vehicleId },
        data: { status: 'available' },
      })
    }

    return updated
  }

  async lookup(email: string, reservationNumber: string) {
    const normalizedEmail = email?.toLowerCase().trim()
    if (!normalizedEmail || !reservationNumber?.trim()) {
      throw new BadRequestException('Email y número de reserva son obligatorios')
    }
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        reservationNumber: reservationNumber.trim().toUpperCase(),
        user: { email: normalizedEmail },
      },
      include: {
        vehicle: { include: { location: true, images: true } },
        user: true,
        pickupLocation: true,
        dropoffLocation: true,
        extras: { include: { extra: true } },
      },
    })
    if (!reservation) {
      throw new BadRequestException('No se encontró ninguna reserva con ese número y email')
    }
    return reservation
  }
}

