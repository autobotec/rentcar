"use client"

import { useTranslations } from "next-intl"
import { dispatchOpenAssistant } from "../lib/assistant-events"

export function FooterAssistantLink({ className }: { className?: string }) {
  const t = useTranslations("footer")
  return (
    <button
      type="button"
      onClick={dispatchOpenAssistant}
      className={className}
    >
      {t("assistantChat")}
    </button>
  )
}
