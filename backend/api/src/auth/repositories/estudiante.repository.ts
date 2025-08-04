// src/auth/repositories/estudiante.repository.ts

import { DataSource, Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EstudianteRepository extends Repository<Estudiante> {
  constructor(private dataSource: DataSource) {
    super(Estudiante, dataSource.createEntityManager());
  }

  /**
   * Encuentra a un estudiante por su email, incluyendo los datos de sus suscripciones y cursos.
   * Este es un ejemplo de cómo encapsular una consulta compleja.
   * @param email El email del estudiante.
   * @returns El estudiante con sus relaciones, o null si no se encuentra.
   */
  public async findByEmailWithRelations(email: string): Promise<Estudiante | null> {
    return this.createQueryBuilder('estudiante')
      .leftJoinAndSelect('estudiante.suscripciones', 'suscripcion')
      .leftJoinAndSelect('suscripcion.curso', 'curso')
      .where('estudiante.email = :email', { email })
      .getOne();
  }
}