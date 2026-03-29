import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common'
import OpenAI from 'openai'
import { existsSync, promises as fs } from 'fs'
import { join, resolve } from 'path'
import { PDFParse } from 'pdf-parse'

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

type StoredChunk = {
  source: string
  text: string
  embedding: number[]
}

function chunkText(text: string, maxLen = 2200, overlap = 200): string[] {
  const t = text.replace(/\r\n/g, '\n').trim()
  if (!t) return []
  const chunks: string[] = []
  let i = 0
  while (i < t.length) {
    chunks.push(t.slice(i, i + maxLen))
    i += maxLen - overlap
  }
  return chunks.filter((c) => c.trim().length > 40)
}

function cosine(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const d = Math.sqrt(na) * Math.sqrt(nb)
  return d === 0 ? 0 : dot / d
}

function keywordScore(query: string, chunk: string): number {
  const qw = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
  const c = chunk.toLowerCase()
  return qw.filter((w) => c.includes(w)).length
}

@Injectable()
export class AssistantService implements OnModuleInit {
  private readonly logger = new Logger(AssistantService.name)
  private openai: OpenAI | null = null
  private chunks: StoredChunk[] = []
  private loadedSources: string[] = []

  async onModuleInit() {
    if (process.env.OPENAI_API_KEY?.trim()) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() })
    } else {
      this.logger.warn('OPENAI_API_KEY no definida: el asistente no podrá generar respuestas.')
    }
    await this.reloadKnowledge()
  }

  private knowledgeDir(): string {
    const fromEnv = process.env.ASSISTANT_DOCS_PATH?.trim()
    if (fromEnv) return resolve(fromEnv)
    return resolve(process.cwd(), 'knowledge-docs')
  }

  getStatus() {
    return {
      openaiConfigured: !!this.openai,
      chunkCount: this.chunks.length,
      sources: this.loadedSources,
      knowledgeDir: this.knowledgeDir(),
      webSearchAvailable: !!process.env.TAVILY_API_KEY?.trim(),
      whatsappOutbound:
        !!process.env.WHATSAPP_CLOUD_TOKEN?.trim() &&
        !!process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID?.trim(),
    }
  }

  async reloadKnowledge() {
    const dir = this.knowledgeDir()
    this.chunks = []
    this.loadedSources = []

    if (!existsSync(dir)) {
      this.logger.warn(`Carpeta de documentos no existe: ${dir}`)
      return
    }

    const entries = await fs.readdir(dir, { withFileTypes: true })
    const texts: { source: string; body: string }[] = []

    for (const ent of entries) {
      if (!ent.isFile()) continue
      const name = ent.name
      if (name.startsWith('.') || name === 'README.md') continue
      const full = join(dir, name)
      const lower = name.toLowerCase()
      try {
        if (lower.endsWith('.pdf')) {
          const buf = await fs.readFile(full)
          const parser = new PDFParse({ data: buf })
          const result = await parser.getText()
          const body = result.text?.trim() ?? ''
          if (body) texts.push({ source: name, body })
        } else if (lower.endsWith('.txt') || lower.endsWith('.md')) {
          const body = (await fs.readFile(full, 'utf8')).trim()
          if (body) texts.push({ source: name, body })
        }
      } catch (e) {
        this.logger.warn(`No se pudo leer ${name}: ${(e as Error).message}`)
      }
    }

    const flatChunks: { source: string; text: string }[] = []
    for (const { source, body } of texts) {
      this.loadedSources.push(source)
      for (const c of chunkText(body)) {
        flatChunks.push({ source, text: c })
      }
    }

    if (!this.openai || flatChunks.length === 0) {
      this.chunks = flatChunks.map((f) => ({ ...f, embedding: [] }))
      this.logger.log(
        `Conocimiento cargado: ${flatChunks.length} fragmentos (${this.openai ? 'sin embeddings' : 'sin OpenAI'})`,
      )
      return
    }

    const inputs = flatChunks.map((f) => f.text.slice(0, 8000))
    const batchSize = 64
    const allEmb: number[][] = []
    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize)
      const res = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: batch,
      })
      for (const item of res.data.sort((a, b) => a.index - b.index)) {
        allEmb.push(item.embedding)
      }
    }

    this.chunks = flatChunks.map((f, idx) => ({
      source: f.source,
      text: f.text,
      embedding: allEmb[idx] ?? [],
    }))
    this.logger.log(`Conocimiento indexado: ${this.chunks.length} fragmentos con embeddings.`)
  }

  private async retrieveWithEmbedding(query: string, topK: number): Promise<StoredChunk[]> {
    if (!this.openai || !this.chunks.length) return []
    if (!this.chunks[0]?.embedding?.length) {
      const scored = this.chunks.map((c) => ({ c, s: keywordScore(query, c.text) }))
      const positive = scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s)
      if (positive.length > 0) {
        return positive.slice(0, topK).map((x) => x.c)
      }
      return this.chunks.slice(0, topK)
    }
    const qEmb = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query.slice(0, 8000),
    })
    const v = qEmb.data[0].embedding
    return [...this.chunks]
      .map((c) => ({ c, s: cosine(v, c.embedding) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, topK)
      .map((x) => x.c)
  }

  private async tavilyContext(query: string): Promise<string | null> {
    const key = process.env.TAVILY_API_KEY?.trim()
    if (!key) return null
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: key,
          query: query.slice(0, 400),
          search_depth: 'basic',
          max_results: 5,
          include_answer: false,
        }),
      })
      if (!res.ok) return null
      const data = (await res.json()) as {
        results?: { title?: string; content?: string; url?: string }[]
      }
      const lines =
        data.results?.map((r) => {
          const t = r.title ?? ''
          const c = r.content ?? ''
          const u = r.url ? ` (${r.url})` : ''
          return `${t}: ${c}${u}`
        }) ?? []
      return lines.length ? lines.join('\n\n') : null
    } catch {
      return null
    }
  }

  private systemPrompt(locale: string, docContext: string, webContext: string | null): string {
    const lang =
      locale === 'en' ? 'English' : locale === 'fr' ? 'French' : 'Spanish'
    let base = `You are a helpful customer assistant for a car rental company (EsAnibal Rent Car, Dominican Republic).
Answer in ${lang}. Be concise, polite, and accurate.
Base your answers primarily on the following internal documentation. If the documentation does not contain the answer, say so clearly.`

    if (webContext) {
      base += `\nYou may supplement with the following web search snippets when relevant; treat them as less authoritative than the internal docs.`
    }

    base += `\n\n--- Internal documentation excerpts ---\n${docContext || '(no documents loaded)'}\n--- End ---`

    if (webContext) {
      base += `\n\n--- Web snippets (optional) ---\n${webContext}\n--- End ---`
    }

    return base
  }

  async chat(input: {
    messages: ChatMessage[]
    useWeb?: boolean
    locale?: string
  }): Promise<{ reply: string; sources: string[]; usedWeb: boolean }> {
    if (!this.openai) {
      throw new ServiceUnavailableException(
        'El asistente requiere OPENAI_API_KEY en el servidor (API).',
      )
    }

    const locale = input.locale === 'en' || input.locale === 'fr' ? input.locale : 'es'
    const list = Array.isArray(input.messages) ? input.messages : []
    const lastUser = [...list].reverse().find((m) => m.role === 'user')
    const queryForRag = lastUser?.content?.trim() || 'general information'

    const retrieved = await this.retrieveWithEmbedding(queryForRag, 6)
    const sources = [...new Set(retrieved.map((c) => c.source))]
    const docContext = retrieved.map((c) => `[${c.source}]\n${c.text}`).join('\n\n---\n\n')

    let webContext: string | null = null
    let usedWeb = false
    if (input.useWeb && process.env.TAVILY_API_KEY?.trim()) {
      webContext = await this.tavilyContext(queryForRag)
      usedWeb = !!webContext
    }

    const system = this.systemPrompt(locale, docContext, webContext)

    const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: system },
      ...list
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
    ]

    const completion = await this.openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini',
      messages: apiMessages,
      temperature: 0.35,
      max_tokens: 900,
    })

    const reply = completion.choices[0]?.message?.content?.trim() || ''
    return { reply, sources, usedWeb }
  }

  async answerSingleQuestion(
    text: string,
    opts: { useWeb?: boolean; locale?: string } = {},
  ): Promise<string> {
    const { reply } = await this.chat({
      messages: [{ role: 'user', content: text }],
      useWeb: opts.useWeb ?? false,
      locale: opts.locale,
    })
    return reply
  }

  async sendWhatsAppText(to: string, body: string) {
    const token = process.env.WHATSAPP_CLOUD_TOKEN?.trim()
    const phoneId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID?.trim()
    if (!token || !phoneId) {
      this.logger.warn('WhatsApp Cloud API no configurada; no se envía respuesta.')
      return
    }
    const text = body.slice(0, 4090)
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      this.logger.error(`WhatsApp send failed: ${res.status} ${err}`)
    }
  }

  async handleWhatsAppWebhook(body: unknown) {
    const b = body as {
      entry?: {
        changes?: {
          value?: {
            messages?: { type?: string; from?: string; text?: { body?: string } }[]
          }
        }[]
      }[]
    }
    const msg = b.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    if (!msg || msg.type !== 'text' || !msg.from || !msg.text?.body) {
      return
    }
    const from = msg.from
    const text = msg.text.body.trim()
    if (!text) return

    try {
      if (!this.openai) {
        await this.sendWhatsAppText(
          from,
          'El asistente automático no está disponible en este momento. Por favor contacta por el formulario web o teléfono.',
        )
        return
      }
      const reply = await this.answerSingleQuestion(text, {
        useWeb: process.env.WHATSAPP_USE_WEB_SEARCH === 'true',
        locale: 'es',
      })
      await this.sendWhatsAppText(from, reply)
    } catch (e) {
      this.logger.error(`WhatsApp handler error: ${(e as Error).message}`)
      await this.sendWhatsAppText(
        from,
        'No pudimos procesar tu mensaje ahora. Intenta de nuevo más tarde o escribe al equipo por la web.',
      )
    }
  }
}
