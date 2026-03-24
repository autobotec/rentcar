"use client"

import { useState, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"

function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <rect width="40" height="24" rx="3" fill="#1A1F71" />
      <text x="20" y="16" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">VISA</text>
    </svg>
  )
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <rect width="40" height="24" rx="3" fill="#f5f5f5" stroke="#e5e5e5" strokeWidth=".5" />
      <circle cx="14" cy="12" r="7" fill="#EB001B" />
      <circle cx="26" cy="12" r="7" fill="#F79E1B" />
    </svg>
  )
}

export function InfoImportanteModal() {
  const t = useTranslations("infoModal")
  const faq = t.raw("faq") as { q: string; a: string }[]
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const openModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  return (
    <>
      <a
        href="#info-importante"
        onClick={openModal}
        className="text-sm font-medium text-teal-600 hover:text-teal-800 underline"
      >
        {t("title")}
      </a>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 shrink-0">
              <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-4 text-sm text-slate-700">
              <table className="w-full border-collapse">
                <tbody className="[&>tr]:border-b [&>tr]:border-slate-200 last:[&>tr]:border-0">
                  {/* Fila 1: Documentación necesaria */}
                  <tr>
                    <td className="align-top py-3 pr-4 font-semibold text-slate-900 w-40 shrink-0">
                      Documentación necesaria
                    </td>
                    <td className="py-3">
                      <p className="mb-1">A la hora de recoger el vehículo, necesitarás:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li>Pasaporte o documento nacional de identidad</li>
                        <li>Permiso de conducir</li>
                        <li>Tarjeta de crédito o débito</li>
                      </ul>
                    </td>
                  </tr>
                  {/* Fila 2: Depósito de seguridad */}
                  <tr>
                    <td className="align-top py-3 pr-4 font-semibold text-slate-900">
                      Depósito de seguridad
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-slate-800">EUR 1.100,00</p>
                      <p>
                        En el momento de la recogida, el conductor principal dejará un depósito de seguridad reembolsable de EUR 1.100,00 en su tarjeta de crédito o débito.
                      </p>
                    </td>
                  </tr>
                  {/* Fila 3: Tarjetas aceptadas + iconos */}
                  <tr>
                    <td className="align-top py-3 pr-4 font-semibold text-slate-900">
                      Tarjetas aceptadas
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5">
                          <VisaIcon className="h-6 w-8" />
                          <span>Visa</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MastercardIcon className="h-6 w-8" />
                          <span>MasterCard</span>
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Fila 4: Franquicia por daños */}
                  <tr>
                    <td className="align-top py-3 pr-4 font-semibold text-slate-900">
                      Franquicia por daños
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-slate-800">EUR 1.100,00</p>
                      <p>
                        Si se daña la carrocería del coche, lo máximo que pagarás por las reparaciones cubiertas por la cobertura parcial por colisión es la franquicia por daños (EUR 1.100,00). La cobertura solo será válida si se cumplen las condiciones del contrato de alquiler. No cubre otras partes del coche (p. ej., ventanas, ruedas, interior o chasis), tasas (remolque, tiempo fuera de carretera) ni objetos de dentro del coche (sillas infantiles, GPS, efectos personales).
                      </p>
                    </td>
                  </tr>
                  {/* Fila 5: Política de combustible y Kilometraje (2 columnas) */}
                  <tr>
                    <td className="align-top py-3 pr-4 font-semibold text-slate-900">
                      Política de combustible / Kilometraje
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-slate-800 mb-1">Depósito al mismo nivel</p>
                      <p className="mb-3">
                        Al recoger el coche, el depósito estará lleno o parcialmente lleno. Deberás dejar un depósito para el combustible (se bloqueará en tu tarjeta). Repón el combustible gastado justo antes de devolver el coche.
                      </p>
                      <p className="font-medium text-slate-800 mb-1">Kilometraje: Ilimitado</p>
                      <p>El alquiler incluye kilómetros sin límite gratis.</p>
                    </td>
                  </tr>
                  {/* Fila 6: una sola columna - texto intro + enlace conceptual al acordeón */}
                  <tr>
                    <td colSpan={2} className="py-3 pt-4 border-t border-slate-200">
                      <p className="text-slate-600">
                        Aquí abajo puedes consultar los términos y condiciones completos del Proveedor de servicios, que incluyen el nombre completo y el domicilio social del Proveedor de servicios, así como información y cargos de los productos y servicios extra que se pueden adquirir en el mostrador o derivados del uso que hagas del alquiler, como el cruce de fronteras y, si los hubiera, los periodos de gracia de recogida y devolución.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Preguntas frecuentes - acordeón */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-3">{t("faqTitle")}</h3>
                <div className="space-y-1">
                  {faq.map((item) => (
                    <details key={item.q} className="group rounded-lg border border-slate-200 bg-slate-50/50">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
                        <span>{item.q}</span>
                        <span className="shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden>▼</span>
                      </summary>
                      <div className="border-t border-slate-200 px-3 py-3 text-slate-600">
                        <p className="text-sm">{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
