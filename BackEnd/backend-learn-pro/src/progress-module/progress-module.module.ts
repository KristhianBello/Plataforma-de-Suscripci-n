// src/progress-module/progress-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule

import { ProgressModuleService } from './progress-module.service';
import { ProgressModuleController } from './progress-module.controller';

// Importa las entidades que este módulo utilizará o a las que hará referencia
import { ProgresoLeccion } from './entities/progress-module.entity'; // Ruta corregida
import { Estudiante } from '../auth-module/entities/Estudiante';     // Desde AuthModule
import { Leccion } from '../courses-module/entities/leccion-module.entity';     // Desde CoursesModule
import { Curso } from '../courses-module/entities/courses-module.entity';       // Desde CoursesModule

// Importa los módulos que proporcionan las dependencias necesarias
import { AuthModule } from '../auth-module/auth-module.module';
import { CoursesModuleModule } from '../courses-module/courses-module.module';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    // Registra las entidades ProgresoLeccion, Estudiante, Leccion y Curso
    // para que ProgressModuleService pueda usarlas.
    TypeOrmModule.forFeature([ProgresoLeccion, Estudiante, Leccion, Curso]),

    // 2. Importa el AuthModule:
    // Esto es crucial porque tu ProgressModuleController utiliza JwtAuthGuard y RolesGuard,
    // que dependen de JwtModule y PassportModule, los cuales son exportados por AuthModule.
    AuthModule,

    // 3. Importa el CoursesModule:
    // Esto es necesario porque el ProgressModuleService interactúa con las entidades Leccion y Curso.
    CoursesModuleModule,
  ],
  controllers: [ProgressModuleController],
  providers: [ProgressModuleService],
  exports: [
    ProgressModuleService, // Exporta el servicio si otros módulos necesitarán interactuar con la lógica de progreso
    TypeOrmModule // Opcional: Si otros módulos necesitan las entidades de progreso directamente
  ]
})
export class ProgressModule {} // Renombrado a ProgressModule por convención (la clase principal del módulo)
