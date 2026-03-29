# Documentación del asistente (RAG)

Coloca aquí archivos **`.pdf`**, **`.txt`** o **`.md`** (excepto este README). Al arrancar la API se indexan y el asistente usa su contenido para responder.

Variables útiles (en `.env` de la API o raíz del monorepo):

- `OPENAI_API_KEY` — obligatorio para el chat.
- `ASSISTANT_DOCS_PATH` — ruta absoluta opcional; por defecto `apps/api/knowledge-docs`.
- `TAVILY_API_KEY` — opcional; búsqua web en el chat si el usuario la activa.
- `OPENAI_CHAT_MODEL` — opcional (por defecto `gpt-4o-mini`).
- `ASSISTANT_RELOAD_SECRET` + header `x-assistant-secret` en `POST /api/assistant/reload-docs` para recargar sin reiniciar.

WhatsApp Cloud API (Meta): `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_CLOUD_PHONE_NUMBER_ID`. Webhook: `GET|POST /api/webhooks/whatsapp`.
