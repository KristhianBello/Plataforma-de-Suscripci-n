// Configuración de la aplicación
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000, // 30 segundos
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
};
