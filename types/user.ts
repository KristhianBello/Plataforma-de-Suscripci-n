export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rol: 'estudiante' | 'administrador';
  isActive: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  rol?: 'estudiante' | 'administrador';
  isActive?: boolean;
  isSuperAdmin?: boolean;
}

export interface UserFilter {
  rol?: 'estudiante' | 'administrador' | 'all';
  isActive?: boolean;
  search?: string;
}
