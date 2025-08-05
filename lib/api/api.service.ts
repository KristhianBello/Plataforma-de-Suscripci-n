import { config } from '@/lib/config';
import { supabase } from '@/lib/supabase';

interface CustomRequestInit extends Omit<RequestInit, 'headers' | 'method'> {
  headers?: Record<string, string>;
}

type RequestOptions = CustomRequestInit & {
  method?: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  data?: unknown;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    
    // Mantiene el stack trace en donde ocurrió el error original
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export class ApiService {
  private readonly baseUrl: string;

  constructor() {
    if (!config?.api?.baseUrl) {
      throw new Error('API base URL is not configured');
    }
    this.baseUrl = config.api.baseUrl;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      return headers;
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return { 'Content-Type': 'application/json' };
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, data, method = 'GET', ...restOptions } = options;

    try {
      // Construir URL con parámetros de consulta
      const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Convertir valores a string de forma segura
            const stringValue = typeof value === 'object' 
              ? JSON.stringify(value) 
              : String(value);
            url.searchParams.append(key, stringValue);
          }
        });
      }

      // Obtener encabezados de autenticación
      const authHeaders = await this.getAuthHeaders();
      
      // Configurar el cuerpo de la petición
      const body = data ? JSON.stringify(data) : undefined;

      const response = await fetch(url.toString(), {
        method,
        headers: {
          ...authHeaders,
          ...headers,
        },
        body,
        ...restOptions,
      });

      let responseData: unknown;
      const contentType = response.headers.get('content-type');
      
      try {
        responseData = contentType?.includes('application/json')
          ? await response.json()
          : await response.text();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new ApiError('Error al procesar la respuesta del servidor', response.status);
      }

      if (!response.ok) {
        const errorMessage = typeof responseData === 'object' && responseData !== null && 'message' in responseData
          ? String((responseData as { message: unknown }).message)
          : 'Error en la petición';
          
        throw new ApiError(
          errorMessage,
          response.status,
          responseData
        );
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al realizar la petición';
        
      throw new ApiError(errorMessage, 0, error);
    }
  }

  // Métodos HTTP
  public async get<T>(
    endpoint: string, 
    params?: Record<string, string | number | boolean | null | undefined>, 
    options: Omit<RequestOptions, 'method' | 'params' | 'data'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'GET', 
      params
    });
  }

  public async post<T>(
    endpoint: string, 
    data?: unknown, 
    options: Omit<RequestOptions, 'method' | 'data' | 'params'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      data 
    });
  }

  public async put<T>(
    endpoint: string, 
    data?: unknown, 
    options: Omit<RequestOptions, 'method' | 'data' | 'params'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      data 
    });
  }

  public async delete<T>(
    endpoint: string, 
    data?: unknown, 
    options: Omit<RequestOptions, 'method' | 'data' | 'params'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'DELETE', 
      data 
    });
  }

  public async patch<T>(
    endpoint: string, 
    data?: unknown, 
    options: Omit<RequestOptions, 'method' | 'data' | 'params'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      data 
    });
  }
}

// Instancia única del servicio
export const apiService = new ApiService();

export default apiService;
