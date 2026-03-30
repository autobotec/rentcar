"use client"

import { useLocale, useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { OPEN_ASSISTANT_EVENT } from "../lib/assistant-events"

type Msg = { role: "user" | "assistant"; content: string }

function apiBase() {
  return (
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "http://localhost:4106/api"
  )
}

export function AssistantChatWidget() {
  const t = useTranslations("assistant")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [useWeb, setUseWeb] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open, loading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput("")
    setError(null)
    const next: Msg[] = [...messages, { role: "user", content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch(`${apiBase()}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          useWeb,
          locale,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        message?: string | string[]
        reply?: string
      }
      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message
        throw new Error(msg || t("error"))
      }
      const reply = typeof data.reply === "string" ? data.reply : t("error")
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error"))
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, useWeb, locale, t])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-2xl text-white shadow-lg transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900 md:bottom-8 md:right-8"
        aria-label={open ? t("close") : t("title")}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          className="fixed inset-x-4 bottom-24 z-[60] flex max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl md:right-8 md:left-auto md:w-[400px]"
          role="dialog"
          aria-labelledby="assistant-chat-title"
        >
          <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
            <h2 id="assistant-chat-title" className="text-sm font-semibold text-white">
              {t("title")}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              aria-label={t("close")}
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            className="min-h-[180px] flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm"
          >
            {messages.length === 0 && (
              <p className="text-zinc-400">{t("intro")}</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-6 rounded-lg bg-teal-900/40 px-3 py-2 text-teal-50"
                    : "mr-4 rounded-lg bg-zinc-800 px-3 py-2 text-zinc-100"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <p className="text-zinc-500">{t("thinking")}</p>
            )}
            {error && <p className="text-red-400">{error}</p>}
          </div>

          <div className="border-t border-zinc-700 px-4 py-3 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={useWeb}
                onChange={(e) => setUseWeb(e.target.checked)}
                className="rounded border-zinc-600"
              />
              {t("useWeb")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                placeholder={t("placeholder")}
                className="min-w-0 flex-1 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={loading || !input.trim()}
                className="shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {t("send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
