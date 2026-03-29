import { Body, Controller, Get, Headers, HttpCode, Post, UnauthorizedException } from '@nestjs/common'
import { AssistantService, type ChatMessage } from './assistant.service'

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('chat')
  @HttpCode(200)
  async chat(
    @Body()
    body: {
      messages?: ChatMessage[]
      useWeb?: boolean
      locale?: string
    },
  ) {
    return this.assistant.chat({
      messages: Array.isArray(body.messages) ? body.messages : [],
      useWeb: Boolean(body.useWeb),
      locale: body.locale,
    })
  }

  @Get('status')
  status() {
    return this.assistant.getStatus()
  }

  /** Recarga PDF/txt desde ASSISTANT_DOCS_PATH. Opcional: ASSISTANT_RELOAD_SECRET + header x-assistant-secret */
  @Post('reload-docs')
  @HttpCode(200)
  async reloadDocs(@Headers('x-assistant-secret') secret: string | undefined) {
    const expected = process.env.ASSISTANT_RELOAD_SECRET?.trim()
    if (expected && secret !== expected) {
      throw new UnauthorizedException()
    }
    await this.assistant.reloadKnowledge()
    return this.assistant.getStatus()
  }
}
