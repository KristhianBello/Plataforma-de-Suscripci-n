## Integrantes del Proyecto

| Nombre Completo        | Usuario de GitHub         |
|------------------------|---------------------------|
| Naomi Carolina Delgado Anchundia   | [@delgadonaomi]
| Gonzalo Alexander Delgado Macias   | [@Alex-20kd]
| Kristhian Augusto Bello Soledispa  | [@KristhianBello]
| Carlos Alberto Delgado Campuzano   | [@carlos-73CK]


📚 LearnPro – Documentación Arquitectónica

-Introducción y Objetivos
LearnPro es una plataforma de educación en línea basada en un modelo de suscripción mensual o anual. Permite a los usuarios acceder a cursos y lecciones de forma personalizada y estructurada, con funcionalidades como seguimiento de progreso, notificaciones y recordatorios automáticos.

Objetivos de arquitectura:

-Escalabilidad horizontal: manejar el crecimiento de usuarios.

-Alta disponibilidad: acceso constante a cursos.

-Modularidad: facilitar mantenimiento y evolución del sistema.

-Seguridad: esencial en pagos y control de acceso a contenido.

🏗️ Estructura del Proyecto


LearnPro/
├── api-gateway/              # Servidor principal con Express y frontend React (Vite)
│   ├── index.js              # Punto de entrada del backend (Express)
│   └── public/               # Cliente React (SPA)
│       ├── index.html
│       ├── main.jsx
│       ├── App.jsx
│       └── ...               # Componentes y páginas del frontend
│
├── core/                     # Núcleo del sistema (siguiendo DDD - Domain Driven Design)
│   ├── application/          # Casos de uso (lógica de aplicación)
│   ├── domain/               # Entidades, interfaces y lógica de negocio
│   └── infrastructure/       # Adaptadores: DB, servicios externos, APIs, etc.
│
├── modules/                  # Módulos funcionales por dominio (ej. auth, courses, payments)
│   ├── auth/                 # Módulo de autenticación y autorización
│   ├── courses/              # Gestión de cursos y lecciones
│   ├── users/                # Gestión de usuarios y suscripciones
│   ├── payments/             # Integración con Stripe y PayPal
│   └── notifications/        # Recordatorios y notificaciones automáticas
│
├── shared/                   # Código compartido (utils, middlewares, validaciones)
│   ├── middlewares/
│   ├── utils/
│   ├── constants/
│   └── config/
│
├── database/                 # Esquema y configuración de Supabase
│   └── supabase-schema.sql   # Script SQL del modelo de datos
│
├── docs/                     # Documentación técnica
│   ├── adr/                  # Architecture Decision Records (ADRs)
│   ├── business-model-canvas.md  # Modelo de negocio (BMC)
│   ├── c4-model.md           # Diagramas C4 (Contexto, Contenedores, Componentes)
│   ├── swagger.yaml          # Especificación OpenAPI (Swagger)
│   └── index.md              # Documentación técnica general
│
├── .env.example              # Archivo ejemplo de variables de entorno
├── .gitignore                # Archivos y carpetas a ignorar por Git
├── package.json              # Dependencias y scripts del proyecto
├── package-lock.json         # Bloqueo de dependencias
└── README.md                 # Documentación principal del proyecto
