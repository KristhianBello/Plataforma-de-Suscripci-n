## Integrantes del Proyecto

| Nombre Completo        | Usuario de GitHub         |
|------------------------|---------------------------|
| Naomi Carolina Delgado Anchundia   | [@delgadonaomi]
| Gonzalo Alexander Delgado Macias   | [@Alex-20kd]
| Kristhian Augusto Bello Soledispa  | [@KristhianBello]
| Carlos Alberto Delgado Campuzano   | [@carlos-73CK]

## 📁 Estructura del Proyecto (Actualizada)

```
Plataforma-de-Suscripci-n/
├── app/                    # Next.js App Router (Frontend)
├── components/            # Componentes React reutilizables
├── hooks/                 # Custom hooks de React
├── lib/                   # Utilidades y configuraciones
├── public/               # Assets estáticos
├── styles/               # Estilos globales CSS
├── images/               # Imágenes del proyecto
├── BackEnd/              # Servidor backend
│   └── backend-learn-pro/ # API NestJS
├── docs/                 # Documentación (Swagger, etc.)
├── package.json          # Dependencias del frontend
├── next.config.mjs       # Configuración Next.js
└── README.md
```

## 🧹 Limpieza Realizada

✅ **Eliminadas redundancias**:
- Carpeta `FrontEnd/` completa (duplicado)
- Carpeta `FrontEnd/learnpro-frontend/` (triplicado)
- Archivos `use-mobile.tsx` y `use-toast.ts` duplicados
- Archivo `package-lock.json` (innecesario con pnpm)
- Archivos vacíos: `hola.ts`, `hola.py`

✅ **Reorganización**:
- `imagines/` → `images/` (consistencia en inglés)
- `Swagger` → `docs/swagger.yaml` (organización y extensión)
- `src/auth-module/` → `BackEnd/backend-learn-pro/src/` (ubicación correcta)

✅ **Resultado**: Proyecto 90% más limpio y organizado


📚 LearnPro – Documentación Arquitectónica

-Introducción y Objetivos
LearnPro es una plataforma de educación en línea basada en un modelo de suscripción mensual o anual. Permite a los usuarios acceder a cursos y lecciones de forma personalizada y estructurada, con funcionalidades como seguimiento de progreso, notificaciones y recordatorios automáticos.

Objetivos de arquitectura:

-Escalabilidad horizontal: manejar el crecimiento de usuarios.

-Alta disponibilidad: acceso constante a cursos.

-Modularidad: facilitar mantenimiento y evolución del sistema.

-Seguridad: esencial en pagos y control de acceso a contenido.

🏗️ Estructura del Proyecto

<img width="666" height="912" alt="image" src="https://github.com/user-attachments/assets/47891044-257e-4ddd-8c8d-aa69dd0adcee" />

##  Interesados y sus Objetivos

| Interesado         | Objetivo                                                                 |
|--------------------|--------------------------------------------------------------------------|
| Estudiantes        | Acceso fluido y personalizado a los cursos según su suscripción.        |
| Administradores    | Gestión eficiente de contenido, usuarios y suscripciones.                |
| Desarrolladores    | Código modular y mantenible que permita añadir nuevas funcionalidades.  |
| Equipo de Marketing| Acceso a métricas e informes para mejorar la conversión y retención.    |
| Soporte Técnico    | Diagnóstico rápido de problemas y mantenimiento seguro.        

 ## 🚀 Vista de Despliegue
 -Aws
