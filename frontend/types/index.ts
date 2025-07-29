export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  company?: string
  bio?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface DashboardData {
  totalRevenue: number
  activeSubscribers: number
  conversionRate: number
  nextPayment: string
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  action: string
  time: string
  status: "success" | "warning" | "error"
}

export interface BillingData {
  currentPlan: string
  monthlyAmount: number
  nextPayment: string
  paymentMethod: PaymentMethod
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
  downloadUrl?: string
}

export interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular: boolean
}

export interface Subscription {
  id: string
  planId: string
  status: "active" | "canceled" | "past_due"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  status: "active" | "inactive"
  description?: string
  createdAt: string
  lastTriggered?: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member"
  status: "active" | "pending"
  joinedAt: string
}

export interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
  }
  subscribers: {
    current: number
    previous: number
    change: number
  }
  churn: {
    current: number
    previous: number
    change: number
  }
  mrr: {
    current: number
    previous: number
    change: number
  }
  topPlans: Array<{
    name: string
    subscribers: number
    revenue: number
  }>
  recentActivity: Array<{
    date: string
    event: string
    value: number
  }>
}
