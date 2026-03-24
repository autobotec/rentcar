"use client"

import Link from "next/link"

export function ContractActions({ reservationId }: { reservationId: string }) {
  return (
    <div className="mt-8 flex gap-4 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Imprimir
      </button>
      <Link
        href={`/reservation/${reservationId}`}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Volver a la reserva
      </Link>
    </div>
  )
}
