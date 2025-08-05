// Exportar servicios de API
export * from './api.service';
export * from './auth.service';

// Exportar instancias por defecto
import { apiService } from './api.service';
import { authService } from './auth.service';

export { apiService, authService };

export default {
  api: apiService,
  auth: authService,
};
