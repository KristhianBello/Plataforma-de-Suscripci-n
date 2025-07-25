// src/courses-module/courses-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule

import { CoursesModuleService } from './courses-module.service';
import { CoursesModuleController } from './courses-module.controller';

// Importa las entidades que este módulo utilizará
import { Curso } from './entities/courses-module.entity';
import { Leccion } from './entities/leccion-module.entity';

// Importa el AuthModule completo para acceder a sus exports (JwtModule, PassportModule, etc.)
import { AuthModule } from '../auth-module/auth-module.module';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    // Registra las entidades Curso y Leccion para que CoursesModuleService pueda usarlas.
    TypeOrmModule.forFeature([Curso, Leccion]),

    // 2. Importa el AuthModule:
    // Esto es crucial porque tu CoursesModuleController utiliza JwtAuthGuard y RolesGuard,
    // que dependen de JwtModule y PassportModule, los cuales son exportados por AuthModule.
    AuthModule,
  ],
  controllers: [CoursesModuleController],
  providers: [CoursesModuleService],
  exports: [
    CoursesModuleService, // Exporta el servicio si otros módulos necesitarán interactuar con la lógica de cursos
    TypeOrmModule // Opcional: Si otros módulos necesitan las entidades de curso directamente
  ]
})
export class CoursesModuleModule {} // Renombrado a CoursesModule por convención (la clase principal del módulo)