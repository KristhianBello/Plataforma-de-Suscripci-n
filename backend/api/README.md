# LearnPro Backend API

Backend API para la plataforma LearnPro de cursos online por suscripción, desarrollado con NestJS.

## 🚀 Tecnologías

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **JWT** - Autenticación
- **Swagger** - Documentación de API
- **Stripe** - Procesamiento de pagos
- **bcryptjs** - Hash de contraseñas

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# o usando pnpm
pnpm install
```

## 🔧 Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
# JWT
JWT_SECRET=your-jwt-secret-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Database (cuando implementes)
DATABASE_URL=your-database-url

# CORS
FRONTEND_URL=http://localhost:3000

# Server
PORT=3001
NODE_ENV=development
```

## 🏃‍♂️ Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Debug
npm run start:debug
```

## 📚 Documentación API

Una vez iniciado el servidor, la documentación de Swagger estará disponible en:
- **Local**: http://localhost:3001/api/docs
- **Producción**: https://your-api-domain.com/api/docs

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de autenticación
│   └── strategies/      # Estrategias de Passport
├── users/               # Módulo de usuarios
├── courses/             # Módulo de cursos
├── subscriptions/       # Módulo de suscripciones
├── payments/            # Módulo de pagos
├── app.module.ts        # Módulo principal
└── main.ts              # Punto de entrada
```

## 🔒 Autenticación

La API utiliza JWT Bearer tokens para autenticación. Para endpoints protegidos, incluye el header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Perfil del usuario (protegido)

### Usuarios
- `GET /users` - Listar usuarios (protegido)
- `GET /users/me` - Perfil actual (protegido)

### Cursos
- `GET /courses` - Listar cursos
- `GET /courses/:id` - Obtener curso por ID
- `POST /courses` - Crear curso (protegido)
- `PUT /courses/:id` - Actualizar curso (protegido)
- `DELETE /courses/:id` - Eliminar curso (protegido)

## 🛠️ Desarrollo

```bash
# Lint
npm run lint

# Format
npm run format

# Build
npm run build
```

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.
