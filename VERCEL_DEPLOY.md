# Plataforma de Suscripción - LearnPro

## Configuración para Deploy en Vercel

### Variables de Entorno Requeridas

En el panel de Vercel, configurar las siguientes variables de entorno:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_de_stripe (opcional)
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe (opcional)
```

### Configuración de Build

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x o superior

### Optimizaciones Implementadas

1. **Next.js 15** con App Router
2. **Dynamic rendering** configurado para páginas que requieren SSR
3. **Images optimized** configurado para Vercel
4. **TypeScript y ESLint** configurados para ignorar errores durante build
5. **Tailwind CSS** optimizado
6. **Supabase** como backend
7. **Stripe** para pagos (opcional)

### Estructura del Proyecto

- `/app` - Páginas y layouts de Next.js
- `/components` - Componentes reutilizables
- `/lib` - Utilidades y configuraciones
- `/hooks` - Hooks personalizados
- `/public` - Archivos estáticos

### Deploy Steps

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Deploy automático

El proyecto está optimizado y listo para producción en Vercel.
