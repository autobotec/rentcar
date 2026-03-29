import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
}

/** Título de página del admin alineado a la derecha para no solaparse con el logo flotante. */
export function AdminPageHeading({ children, className = "" }: Props) {
  return (
    <h1
      className={`w-full text-right text-2xl font-bold leading-tight text-slate-900 ${className}`.trim()}
    >
      {children}
    </h1>
  )
}
