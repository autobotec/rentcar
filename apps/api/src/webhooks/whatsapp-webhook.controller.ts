import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common'
import type { Response } from 'express'
import { AssistantService } from '../assistant/assistant.service'

@Controller('webhooks')
export class WhatsappWebhookController {
  constructor(private readonly assistant: AssistantService) {}

  /**
   * Verificación Meta Cloud API: URL de callback GET.
   * Misma ruta base: /api/webhooks/whatsapp
   */
  @Get('whatsapp')
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verify = process.env.WHATSAPP_VERIFY_TOKEN?.trim()
    if (mode === 'subscribe' && verify && token === verify && challenge) {
      return res.status(200).send(challenge)
    }
    return res.status(403).send('Forbidden')
  }

  @Post('whatsapp')
  @HttpCode(200)
  async incoming(@Body() body: unknown) {
    await this.assistant.handleWhatsAppWebhook(body)
    return { success: true }
  }
}
