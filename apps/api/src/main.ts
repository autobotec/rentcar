import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar .env: raíz del monorepo o carpeta actual
const rootEnv = resolve(process.cwd(), '../../.env')
const cwdEnv = resolve(process.cwd(), '.env')
const webEnv = resolve(process.cwd(), '../web/.env')
config({ path: rootEnv })
config({ path: cwdEnv })
// Usamos el .env del frontend para keys de pagos en entornos de desarrollo.
// Esto evita duplicar secretos en el .env raíz.
config({ path: webEnv })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })

  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 4100
  await app.listen(port)
  console.log(`API listening on http://localhost:${port}/api`)
}

bootstrap()


