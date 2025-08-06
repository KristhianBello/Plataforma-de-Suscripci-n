# 🔧 Configuración de Stripe para la Plataforma de Suscripción

## 📋 Instrucciones para configurar Stripe

### 1. Crear cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com)
2. Crea una cuenta o inicia sesión
3. Activa tu cuenta siguiendo los pasos de verificación

### 2. Obtener las claves de API

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com)
2. En el menú lateral, haz clic en "Developers" → "API keys"
3. Copia las siguientes claves:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 3. Configurar variables de entorno

Edita tu archivo `.env.local` con las claves reales:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_AQUI
```

### 4. Crear productos y precios en Stripe

1. En el Dashboard de Stripe, ve a "Products"
2. Crea un producto llamado "Plan Pro"
3. Agrega dos precios:
   - **Mensual**: $18/mes
   - **Anual**: $80/año

4. Copia los Price IDs y agrégalos a tu `.env.local`:

```bash
# Stripe Price IDs
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_TU_PRICE_ID_MENSUAL
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID=price_TU_PRICE_ID_ANUAL
STRIPE_MONTHLY_PRICE_ID=price_TU_PRICE_ID_MENSUAL
STRIPE_ANNUAL_PRICE_ID=price_TU_PRICE_ID_ANUAL
```

### 5. Probar la configuración

1. Reinicia tu servidor de desarrollo
2. Ve a `/api/stripe/test` para verificar que la configuración funcione
3. Si ves `"success": true`, ¡todo está configurado correctamente!

## 🚧 Modo de Desarrollo

Si no tienes configurado Stripe aún, la aplicación funcionará en **modo de desarrollo**:

- ✅ Se simulan pagos exitosos
- ⚠️ No se realizan cargos reales
- 🔧 Perfecto para desarrollo y pruebas

## 🔍 Solución de problemas

### Error: "Invalid API Key"
- Verifica que las claves empiecen con `pk_test_` y `sk_test_`
- Asegúrate de no tener espacios extra en las claves
- Confirma que las claves sean de la misma cuenta de Stripe

### Error: "Price ID not found"
- Verifica que los Price IDs existan en tu cuenta de Stripe
- Confirma que los precios estén activos
- Asegúrate de usar los IDs correctos para test/producción

### La página usa modo de desarrollo
- Verifica que todas las variables de entorno estén configuradas
- Reinicia el servidor después de cambiar las variables
- Revisa la consola del navegador para más detalles

## 📝 Variables de entorno completas

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID=price_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...

# PayPal Configuration (opcional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

## 🎯 Próximos pasos

Una vez que tengas Stripe configurado correctamente:

1. La página de pago usará el formulario real de Stripe
2. Los pagos se procesarán mediante Stripe
3. Los webhooks manejarán las confirmaciones de pago
4. Los usuarios tendrán acceso completo a las funcionalidades

¿Necesitas ayuda? Revisa la [documentación de Stripe](https://stripe.com/docs) o contacta al equipo de desarrollo.
