import { Module } from '@nestjs/common'
import { AssistantController } from './assistant.controller'
import { AssistantService } from './assistant.service'
import { WhatsappWebhookController } from '../webhooks/whatsapp-webhook.controller'

@Module({
  controllers: [AssistantController, WhatsappWebhookController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
