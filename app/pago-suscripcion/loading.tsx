"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Cargando página de pago...
        </h2>
        <p className="text-gray-600">
          Preparando tu experiencia de pago segura
        </p>
      </div>
    </div>
  )
}
