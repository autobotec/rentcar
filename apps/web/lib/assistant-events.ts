/** Evento global para abrir el widget de asistente desde el footer u otros enlaces. */
export const OPEN_ASSISTANT_EVENT = "esa-open-assistant"

export function dispatchOpenAssistant() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT))
}
