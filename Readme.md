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



Restricciones
•	Tecnología Web: Se utilizará una aplicación de una sola página (SPA) para el frontend.
•	Backend: Desarrollado en Node.js, utilizando el framework NestJS.
•	Base de Datos: Se empleará PostgreSQL como sistema de gestión de bases de datos.
•	Pasarelas de Pago: Las integraciones deben ser compatibles con Stripe y PayPal.
•	Cumplimiento Normativo: Adherencia a GDPR para la protección de datos personales.
•	Internacionalización: La plataforma debe estar disponible en inglés y español.

-Interesados y sus Objetivos
Interesado	Objetivo
Estudiantes	Acceso fluido y personalizado a los cursos según su suscripción.
Administradores	Gestionar contenido y suscripciones eficientemente.
Desarrolladores	Facilidad para extender funcionalidades y mantener el sistema.
Equipo de Marketing	Acceder a métricas de uso para mejorar conversión y retención.
Soporte Técnico	Diagnóstico rápido de problemas y mantenimiento seguro.

-Estrategia de Solución
La plataforma LearnPro adoptará una arquitectura Monolítica Modular. Esta elección busca equilibrar la simplicidad de un único despliegue con los beneficios de organización y mantenibilidad de una arquitectura modular. El sistema se estructurará internamente en módulos bien definidos, cada uno con responsabilidades específicas, facilitando la implementación de patrones de diseño y el cumplimiento de los requisitos de calidad.

-Tecnologías Clave:
•	Frontend (Web App): React
•	Backend (API Backend): NestJS (Node.js/TypeScript)
•	Base de Datos: Supabase PostgreSQL
•	Pasarelas de Pago: Stripe, PayPal
•	Despliegue Local: Docker Compose
•	CI/CD: GitHub Actions

-Vista de Despliegue
La arquitectura se basa en contenedores para facilitar el despliegue y la escalabilidad.
Diagrama de Despliegue (simplificado):
[Browser] -> [Nginx / Load Balancer] -> [App Node.js (NestJS)] -> [PostgreSQL DB (Supabase)]
                                          |
                                          +--> [Worker de notificaciones (interno al App Node.js)]
                                          +--> [Stripe/PayPal Webhooks Handler (interno al App Node.js)]

Detalles de Implementación:
•	Contenedores: La aplicación Node.js (NestJS) se empaquetará en un contenedor Docker.
•	Base de Datos: Se utilizará Supabase PostgreSQL como servicio gestionado, eliminando la necesidad de desplegar y mantener un contenedor de base de datos propio.
•	Balanceador de Carga: En producción, se utilizará un balanceador de carga (ej. Nginx o el balanceador nativo del proveedor cloud) para distribuir el tráfico entre múltiples instancias del backend.
•	Ambientes: Se configurarán ambientes de desarrollo, staging y producción con despliegues automatizados (CI/CD con GitHub Actions).
•	Backups: Se implementarán backups automatizados de la base de datos de Supabase.

-Decisiones de Arquitectura
•	Elección de Modelo Arquitectónico (Monolito Modular): Se opta por un monolito modular para equilibrar la simplicidad de despliegue con la necesidad de modularidad y mantenibilidad. Permite una evolución controlada y una posible futura migración a microservicios si la escala lo requiere.
•	Framework Backend (NestJS): Seleccionado por su estructura modular, soporte robusto para REST/GraphQL, inyección de dependencias, y facilidad para implementar patrones de diseño y middlewares. Su base en TypeScript mejora la calidad y mantenibilidad del código.
•	Base de Datos (Supabase PostgreSQL): Elegido por ser un servicio PostgreSQL gestionado, lo que reduce la carga operativa de la base de datos, además de ofrecer un ecosistema de herramientas (autenticación, almacenamiento) que pueden simplificar el desarrollo.
•	Pasarelas de Pago (Stripe, PayPal): Seleccionadas por su amplia adopción, robustez en pagos recurrentes y APIs bien documentadas.
•	Patrones de Diseño Obligatorios:
o	Repository Pattern: Para abstraer la capa de persistencia y desacoplar la lógica de negocio de los detalles de la base de datos.
o	Strategy Pattern: Para encapsular algoritmos intercambiables, como diferentes métodos de pago o tipos de notificación.
o	Factory Method: Para la creación de objetos complejos, como instancias de clientes de pasarelas de pago.
o	Singleton: Para asegurar que ciertas clases (ej. servicios de configuración o loggers) tengan una única instancia global (los servicios de NestJS son singletons por defecto).


