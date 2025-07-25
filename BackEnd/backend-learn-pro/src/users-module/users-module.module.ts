// src/users-module/users-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule

import { UsersModuleService } from './users-module.service';
import { UsersModuleController } from './users-module.controller';

// Importa las entidades que este módulo utilizará (desde el AuthModule, ya que las reutilizas)
import { Estudiante } from '../auth-module/entities/Estudiante';
import { Administrador } from '../auth-module/entities/Administrador';

// Importa el AuthModule completo para acceder a sus exports (JwtModule, PassportModule, etc.)
import { AuthModule } from '../auth-module/auth-module.module';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    // Registra las entidades Estudiante y Administrador para que UsersModuleService pueda usarlas.
    TypeOrmModule.forFeature([Estudiante, Administrador]),

    // 2. Importa el AuthModule:
    // Esto es crucial porque tu UsersModuleController utiliza JwtAuthGuard y RolesGuard,
    // que dependen de JwtModule y PassportModule, los cuales son exportados por AuthModule.
    AuthModule,
  ],
  controllers: [UsersModuleController],
  providers: [UsersModuleService],
  exports: [
    UsersModuleService, // Exporta el servicio si otros módulos necesitarán interactuar con la lógica de usuarios
    TypeOrmModule // Opcional: Si otros módulos necesitan las entidades de usuario directamente
  ]
})
export class UsersModuleModule {} // Renombrado a UsersModule para consistencia en la convención