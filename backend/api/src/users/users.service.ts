import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../auth/entities/estudiante.entity';
import { Administrador } from '../auth/entities/administrador.entity';

export type User = Estudiante | Administrador;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
  ) {}

  async create(userData: any): Promise<User> {
    if (userData.rol === 'administrador') {
      const admin = this.administradorRepository.create(userData);
      return await this.administradorRepository.save(admin) as unknown as User;
    } else {
      const estudiante = this.estudianteRepository.create(userData);
      return await this.estudianteRepository.save(estudiante) as unknown as User;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    // Buscar en ambas tablas
    let user = await this.estudianteRepository.findOne({ where: { email } });
    if (!user) {
      user = await this.administradorRepository.findOne({ where: { email } });
    }
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    // Buscar en ambas tablas
    let user = await this.estudianteRepository.findOne({ where: { id } });
    if (!user) {
      user = await this.administradorRepository.findOne({ where: { id } });
    }
    return user;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const estudiantes = await this.estudianteRepository.find();
    const administradores = await this.administradorRepository.find();
    
    const allUsers = [...estudiantes, ...administradores];
    return allUsers.map(({ password, ...user }) => user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User | undefined> {
    // Buscar en ambas tablas
    let user = await this.estudianteRepository.findOne({ where: { id } });
    if (user) {
      Object.assign(user, updateData);
      return await this.estudianteRepository.save(user) as unknown as User;
    }

    user = await this.administradorRepository.findOne({ where: { id } });
    if (user) {
      Object.assign(user, updateData);
      return await this.administradorRepository.save(user) as unknown as User;
    }

    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    // Intentar eliminar de ambas tablas
    let result = await this.estudianteRepository.delete(id);
    if (result.affected === 0) {
      result = await this.administradorRepository.delete(id);
    }
    return result.affected > 0;
  }
}
