## Integrantes del Proyecto

| Nombre Completo        | Usuario de GitHub         |
|------------------------|---------------------------|
| Naomi Carolina Delgado Anchundia   | [@delgadonaomi]
| Gonzalo Alexander Delgado Macias   | [@Alex-20kd]
| Kristhian Augusto Bello Soledispa  | [@KristhianBello]
| Carlos Alberto Delgado Campuzano   | [@carlos-73CK]



# 📚 Documentación de la API

## Autenticación

La API utiliza autenticación basada en tokens JWT. Incluye el token en el encabezado `Authorization` de las peticiones:

```
Authorization: Bearer <tu_token_jwt>
```

## Endpoints de Autenticación

### Iniciar Sesión

```http
POST /auth/login
```

**Cuerpo de la petición:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Registrar Usuario

```http
POST /auth/register
```

**Cuerpo de la petición:**
```json
{
  "email": "nuevo@usuario.com",
  "password": "contraseña123",
  "fullName": "Nombre Completo"
}
```

### Cerrar Sesión

```http
POST /auth/logout
```

### Obtener Usuario Actual

```http
GET /auth/me
```

## Manejo de Errores

La API devuelve respuestas de error estandarizadas:

```json
{
  "statusCode": 400,
  "message": "Mensaje de error descriptivo",
  "error": "Bad Request"
}
```

## Estructura del Proyecto

```
Plataforma-de-Suscripci-n/
├── app/                    # Next.js App Router (Frontend)
├── components/            # Componentes React reutilizables
├── hooks/                 # Custom hooks de React
├── lib/                   # Utilidades y configuraciones
│   ├── api/               # Servicios de API
│   │   ├── api.service.ts # Cliente HTTP
│   │   └── auth.service.ts# Servicio de autenticación
│   └── supabase.ts        # Configuración de Supabase
├── public/               # Assets estáticos
└── ...
```

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

##  Interesados y sus Objetivos


| Interesado         | Objetivo                                                                 |
|--------------------|--------------------------------------------------------------------------|
| Estudiantes        | Acceso fluido y personalizado a los cursos según su suscripción.        |
| Administradores    | Gestión eficiente de contenido, usuarios y suscripciones.                |
| Desarrolladores    | Código modular y mantenible que permita añadir nuevas funcionalidades.  |
| Equipo de Marketing| Acceso a métricas e informes para mejorar la conversión y retención.    |
| Soporte Técnico    | Diagnóstico rápido de problemas y mantenimiento seguro.        

Instalación

1. Clonar el repositorio:
```
git clone https://github.com/KristhianBello/Plataforma-de-Suscripci-n.git
```
```
cd Plataforma-de-Suscripci-n
```
2. Instala dependencias del frontend:
```
npm install
```
3. Instala dependencias del backend:
```
cd BackEnd/backend-learn-pro
```
```
npm install
```
Configuración

-Copiar el archivo de ejemplo de variables de entorno:
```
cp .env.example .env
```
-Editar .env con las credenciales necesarias para la base de datos, puertos, claves API, etc.

-Configurar la base de datos y ejecutar migraciones si aplica (consultar documentación interna o scripts incluidos).

Ejecución

Frontend

Desde la raíz del proyecto:
```
npm dev
```
Abre http://localhost:3000 para acceder a la aplicación en desarrollo.

Backend

Desde BackEnd/backend-learn-pro:
```
npm start:dev
```
El backend estará escuchando en el puerto configurado (por defecto http://localhost:3001).

Testing

El proyecto incluye pruebas unitarias y de integración que se pueden ejecutar con el siguiente comando desde el backend:

```npm test```

 ## 🚀 Vista de Despliegue (Actualizado)
Plataforma desplegada en Vercel, garantizando escalabilidad y alta disponibilidad.

hola voy a arreglar el backend

