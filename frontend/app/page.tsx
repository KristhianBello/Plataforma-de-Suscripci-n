"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Home } from "@/pages/home"
import { Plans } from "@/pages/plans"
import { Login } from "@/pages/auth/login"
import { Register } from "@/pages/auth/register"
import { Dashboard } from "@/pages/dashboard"
import { Profile } from "@/pages/profile"
import { Billing } from "@/pages/billing"
import { Analytics } from "@/pages/analytics"
import { Webhooks } from "@/pages/webhooks"
import { Settings } from "@/pages/settings"
import { Team } from "@/pages/team"
import { Support } from "@/pages/support"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute>
                        <Billing />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/webhooks"
                    element={
                      <ProtectedRoute>
                        <Webhooks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <ProtectedRoute>
                        <Team />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/support"
                    element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
              <Toaster />
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
