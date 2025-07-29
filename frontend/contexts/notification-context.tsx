"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  showSuccess: (message: string, description?: string) => void
  showError: (message: string, description?: string) => void
  showInfo: (message: string, description?: string) => void
  showWarning: (message: string, description?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default",
    })
  }

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive",
    })
  }

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default",
    })
  }

  const showWarning = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive",
    })
  }

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
