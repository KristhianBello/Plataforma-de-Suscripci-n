import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Clave para los metadatos
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);