import { apiService } from './api.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  fullName: string;
  // Agrega más campos según sea necesario
}

export interface AuthResponse {
  user: any;
  session: any;
  error?: any;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await apiService.get<any>('/auth/me');
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

export default authService;
