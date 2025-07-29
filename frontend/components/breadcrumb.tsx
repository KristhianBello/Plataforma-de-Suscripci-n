"use client"

import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  billing: "Facturación",
  webhooks: "Webhooks",
  team: "Equipo",
  profile: "Perfil",
  settings: "Configuración",
  support: "Soporte",
}

export function Breadcrumb() {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)

  if (pathSegments.length === 0) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link to="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {pathSegments.map((segment, index) => {
        const path = "/" + pathSegments.slice(0, index + 1).join("/")
        const isLast = index === pathSegments.length - 1
        const name = routeNames[segment] || segment

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : (
              <Link to={path} className="hover:text-foreground transition-colors">
                {name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
