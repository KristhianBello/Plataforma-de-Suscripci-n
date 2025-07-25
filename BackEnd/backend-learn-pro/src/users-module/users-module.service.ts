// src/users-module/users-module.service.ts

import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

// Importa las entidades desde el AuthModule (ya que las estás reutilizando)
import { Estudiante } from '../auth-module/entities/Estudiante';
import { Administrador } from '../auth-module/entities/Administrador';

// Importa los DTOs correctos para este módulo
import { UpdateEstudianteProfileDto } from './dto/Estudiante/update-users-Estudiante.dto'; // Ruta ajustada
import { UpdateAdminProfileDto } from './dto/Administrador/update-users-Administrador.dto'; // Ruta ajustada
import { ChangePasswordDto } from './dto/change-password.dto'; // Ruta ajustada

@Injectable()
export class UsersModuleService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
  ) {}

  /**
   * Obtiene el perfil de un estudiante por su ID.
   * @param id ID del estudiante.
   * @returns El objeto Estudiante.
   */
  async getEstudianteProfile(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado.`);
    }
    return estudiante;
  }

  /**
   * Obtiene el perfil de un administrador por su ID.
   * @param id ID del administrador.
   * @returns El objeto Administrador.
   */
  async getAdminProfile(id: number): Promise<Administrador> {
    const admin = await this.administradorRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Administrador con ID ${id} no encontrado.`);
    }
    return admin;
  }

  /**
   * Actualiza el perfil de un estudiante.
   * @param id ID del estudiante a actualizar.
   * @param updateEstudianteDto Datos para actualizar el perfil del estudiante.
   * @returns El estudiante actualizado.
   */
  async updateEstudianteProfile(id: number, updateEstudianteDto: UpdateEstudianteProfileDto): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado.`);
    }

    // Si se intenta cambiar el email, verificar que no esté ya en uso por otro estudiante
    if (updateEstudianteDto.email && updateEstudianteDto.email !== estudiante.email) {
      const existingEstudiante = await this.estudianteRepository.findOne({ where: { email: updateEstudianteDto.email } });
      if (existingEstudiante) {
        throw new BadRequestException('El nuevo correo electrónico ya está en uso.');
      }
    }

    // Actualizar las propiedades del estudiante
    Object.assign(estudiante, updateEstudianteDto);
    return this.estudianteRepository.save(estudiante);
  }

  /**
   * Actualiza el perfil de un administrador.
   * @param id ID del administrador a actualizar.
   * @param updateAdminDto Datos para actualizar el perfil del administrador.
   * @returns El administrador actualizado.
   */
  async updateAdminProfile(id: number, updateAdminDto: UpdateAdminProfileDto): Promise<Administrador> {
    const admin = await this.administradorRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Administrador con ID ${id} no encontrado.`);
    }

    // Si se intenta cambiar el email o nombre de usuario, verificar unicidad
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingAdmin = await this.administradorRepository.findOne({ where: { email: updateAdminDto.email } });
      if (existingAdmin) {
        throw new BadRequestException('El nuevo correo electrónico ya está en uso por otro administrador.');
      }
    }
    if (updateAdminDto.nombre_usuario && updateAdminDto.nombre_usuario !== admin.nombre_usuario) {
      const existingAdmin = await this.administradorRepository.findOne({ where: { nombre_usuario: updateAdminDto.nombre_usuario } });
      if (existingAdmin) {
        throw new BadRequestException('El nuevo nombre de usuario ya está en uso por otro administrador.');
      }
    }

    Object.assign(admin, updateAdminDto);
    return this.administradorRepository.save(admin);
  }

  /**
   * Permite a un usuario (estudiante o administrador) cambiar su contraseña.
   * @param userId ID del usuario.
   * @param userRole Rol del usuario ('estudiante' o 'administrador').
   * @param changePasswordDto DTO con la contraseña actual y la nueva.
   */
  async changePassword(userId: number, userRole: 'estudiante' | 'administrador', changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('La nueva contraseña y su confirmación no coinciden.');
    }

    let user: Estudiante | Administrador | null;
    if (userRole === 'estudiante') {
      user = await this.estudianteRepository.findOne({ where: { id: userId } });
    } else {
      user = await this.administradorRepository.findOne({ where: { id: userId } });
    }

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Comparar la contraseña actual proporcionada con el hash almacenado
    const storedPasswordHash = userRole === 'estudiante' ? (user as Estudiante).contraseña : (user as Administrador).contrasena_hash;
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la entidad
    if (userRole === 'estudiante') {
      (user as Estudiante).contraseña = hashedNewPassword;
      await this.estudianteRepository.save(user as Estudiante);
    } else {
      (user as Administrador).contrasena_hash = hashedNewPassword;
      await this.administradorRepository.save(user as Administrador);
    }

    return { message: 'Contraseña actualizada exitosamente.' };
  }

  /**
   * Obtiene todos los estudiantes (solo para administradores).
   * @returns Lista de estudiantes.
   */
  async findAllEstudiantes(): Promise<Estudiante[]> {
    return this.estudianteRepository.find();
  }

  /**
   * Obtiene todos los administradores (solo para super_admin).
   * @returns Lista de administradores.
   */
  async findAllAdmins(): Promise<Administrador[]> {
    return this.administradorRepository.find();
  }

  /**
   * Elimina un estudiante por su ID (solo para administradores).
   * @param id ID del estudiante a eliminar.
   */
  async removeEstudiante(id: number): Promise<void> {
    const result = await this.estudianteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado.`);
    }
  }

  /**
   * Elimina un administrador por su ID (solo para super_admin).
   * @param id ID del administrador a eliminar.
   */
  async removeAdmin(id: number): Promise<void> {
    const result = await this.administradorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Administrador con ID ${id} no encontrado.`);
    }
  }
}