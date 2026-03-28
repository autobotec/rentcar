"use client"

import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { submitContact } from "../app/[locale]/contact/actions"

export function ContactForm() {
  const t = useTranslations("contactPage")
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<"ok" | null>(null)
  const [errorKey, setErrorKey] = useState<string | null>(null)

  return (
    <form
      className="mx-auto max-w-lg space-y-4 rounded-2xl border border-zinc-300 bg-white p-6 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.35)]"
      onSubmit={(e) => {
        e.preventDefault()
        setFeedback(null)
        setErrorKey(null)
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          const r = await submitContact(fd)
          if (r.ok) {
            setFeedback("ok")
            e.currentTarget.reset()
          } else {
            setErrorKey(r.errorKey)
          }
        })
      }}
    >
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
          {t("name")} <span className="text-red-600">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
          {t("email")} <span className="text-red-600">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700">
          {t("phone")}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
          {t("message")} <span className="text-red-600">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {errorKey && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{t(errorKey)}</p>
      )}
      {feedback === "ok" && (
        <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-900">{t("success")}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700 disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  )
}
