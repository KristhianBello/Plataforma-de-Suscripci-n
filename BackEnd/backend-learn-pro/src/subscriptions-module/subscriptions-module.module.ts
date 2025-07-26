// src/subscriptions-module/subscriptions-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule

import { SubscriptionsModuleService } from './subscriptions-module.service';
import { SubscriptionsModuleController } from './subscriptions-module.controller';

// Importa las entidades que este módulo utilizará o a las que hará referencia
import { Suscripcion } from './entities/subscriptions-module.entity';
import { Estudiante } from '../auth-module/entities/Estudiante'; // Necesario para el servicio
import { Curso } from '../courses-module/entities/courses-module.entity';       // Necesario para el servicio

// Importa los módulos que proporcionan las dependencias necesarias
import { AuthModule } from '../auth-module/auth-module.module';
import { CoursesModuleModule } from '../courses-module/courses-module.module';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    // Registra las entidades Suscripcion, Estudiante y Curso para que SubscriptionsModuleService pueda usarlas.
    TypeOrmModule.forFeature([Suscripcion, Estudiante, Curso]),

    // 2. Importa el AuthModule:
    // Esto es crucial porque tu SubscriptionsModuleController utiliza JwtAuthGuard y RolesGuard,
    // que dependen de JwtModule y PassportModule, los cuales son exportados por AuthModule.
    AuthModule,

    // 3. Importa el CoursesModule:
    // Esto es necesario porque el SubscriptionsModuleService interactúa con la entidad Curso.
    CoursesModuleModule,
  ],
  controllers: [SubscriptionsModuleController],
  providers: [SubscriptionsModuleService],
  exports: [
    SubscriptionsModuleService, // Exporta el servicio si otros módulos necesitarán interactuar con la lógica de suscripciones
    TypeOrmModule // Opcional: Si otros módulos necesitan las entidades de suscripción directamente
  ]
})
export class SubscriptionsModule {} // Renombrado a SubscriptionsModule por convención (la clase principal del módulo)