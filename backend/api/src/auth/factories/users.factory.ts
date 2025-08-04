// src/auth-module/factories/user.factory.ts

import { Injectable } from '@nestjs/common';
import { Estudiante } from '../entities/estudiante.entity';
import { Administrador } from '../entities/administrador.entity';

// Define una interfaz o tipo que las entidades deben cumplir
// Esto ayuda al tipado y a la consistencia
export type UserEntity = Estudiante | Administrador;

@Injectable()
export class UserFactory {
  /**
   * Crea una instancia de usuario (Estudiante o Administrador) basada en el rol.
   * @param rol El rol del usuario a crear.
   * @returns La entidad de usuario correspondiente.
   * @throws {Error} Si el rol no es válido.
   */
  public createUser(rol: 'estudiante' | 'administrador'): UserEntity {
    switch (rol) {
      case 'estudiante':
        return new Estudiante();
      case 'administrador':
        return new Administrador();
      default:
        // En una aplicación real, probablemente harías una validación previa
        // o lanzarías una excepción de NestJS, como BadRequestException.
        throw new Error(`Rol de usuario no válido: ${rol}`);
    }
  }
}