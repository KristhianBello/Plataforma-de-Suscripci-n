import axios from "axios"
import type { User, DashboardData, BillingData, Invoice } from "@/types"

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
})

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const apiService = {
  // Autenticación
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post("/auth/register", { name, email, password })
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/auth/me")
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put("/auth/profile", data)
    return response.data
  },

  // Dashboard
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get("/dashboard")
    return response.data
  },

  // Facturación
  async getBillingData(): Promise<BillingData> {
    const response = await api.get("/billing")
    return response.data
  },

  async getInvoices(): Promise<Invoice[]> {
    const response = await api.get("/billing/invoices")
    return response.data
  },

  // Suscripciones
  async getSubscriptions() {
    const response = await api.get("/subscriptions")
    return response.data
  },

  async createSubscription(planId: string) {
    const response = await api.post("/subscriptions", { planId })
    return response.data
  },

  async cancelSubscription(subscriptionId: string) {
    const response = await api.delete(`/subscriptions/${subscriptionId}`)
    return response.data
  },

  // Planes
  async getPlans() {
    const response = await api.get("/plans")
    return response.data
  },

  // Webhooks
  async getWebhooks() {
    const response = await api.get("/webhooks")
    return response.data
  },

  async createWebhook(url: string, events: string[]) {
    const response = await api.post("/webhooks", { url, events })
    return response.data
  },

  async deleteWebhook(webhookId: string) {
    const response = await api.delete(`/webhooks/${webhookId}`)
    return response.data
  },
}

export default api
