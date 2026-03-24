"use client"

import { useEffect } from "react"

export type ToastType = "success" | "error"

type ToastProps = {
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  const isSuccess = type === "success"
  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border px-4 py-3 shadow-lg"
      style={{
        backgroundColor: isSuccess ? "#f0fdf4" : "#fef2f2",
        borderColor: isSuccess ? "#86efac" : "#fecaca",
        color: isSuccess ? "#166534" : "#991b1b",
      }}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
