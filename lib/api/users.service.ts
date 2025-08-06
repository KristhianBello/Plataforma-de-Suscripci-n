import { apiService } from './api.service';
import { User, UserUpdateData, UserFilter } from '@/types/user';

export class UsersApiService {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>('/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUser(id: string, updateData: UserUpdateData): Promise<User> {
    try {
      const response = await apiService.put<User>(`/users/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete<boolean>(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async updateUserRole(id: string, rol: 'estudiante' | 'administrador'): Promise<User> {
    try {
      const response = await apiService.put<User>(`/users/${id}`, { rol });
      return response;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    try {
      const response = await apiService.put<User>(`/users/${id}`, { isActive });
      return response;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }
}

export const usersApiService = new UsersApiService();
