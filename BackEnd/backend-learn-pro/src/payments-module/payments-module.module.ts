// src/payments-module/payments-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule

import { PaymentsModuleService } from './payments-module.service';
import { PaymentsModuleController } from './payments-module.controller';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

// Importa las entidades que este módulo utilizará o a las que hará referencia
import { Transaccion } from './entities/payments-module.entity';
import { Estudiante } from '../auth-module/entities/Estudiante';         // Desde AuthModule
import { Suscripcion } from '../subscriptions-module/entities/subscriptions-module.entity'; // Desde SubscriptionsModule
import { Curso } from '../courses-module/entities/courses-module.entity';           // Desde CoursesModule

// Importa los módulos que proporcionan las dependencias necesarias
import { AuthModule } from '../auth-module/auth-module.module';
import { SubscriptionsModule } from '../subscriptions-module/subscriptions-module.module';
import { CoursesModuleModule } from '../courses-module/courses-module.module';
import { NotificationsModule } from '../notifications-module/notifications.module';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    // Registra las entidades Transaccion, Estudiante, Suscripcion y Curso
    // para que PaymentsModuleService pueda usarlas.
    TypeOrmModule.forFeature([Transaccion, Estudiante, Suscripcion, Curso]),

    // 2. Importa el AuthModule:
    // Esto es crucial porque tu PaymentsModuleController utiliza JwtAuthGuard y RolesGuard,
    // que dependen de JwtModule y PassportModule, los cuales son exportados por AuthModule.
    AuthModule,

    // 3. Importa el SubscriptionsModule:
    // Esto es necesario porque el PaymentsModuleService interactúa con la entidad Suscripcion.
    SubscriptionsModule,

    // 4. Importa el CoursesModule:
    // Esto es necesario porque el PaymentsModuleService interactúa con la entidad Curso.
    CoursesModuleModule,
    
    // 5. Importa el NotificationsModule:
    // Necesario para enviar notificaciones de pagos
    NotificationsModule,
  ],
  controllers: [PaymentsModuleController, StripeController],
  providers: [PaymentsModuleService, StripeService],
  exports: [
    PaymentsModuleService, // Exporta el servicio si otros módulos necesitarán interactuar con la lógica de pagos
    TypeOrmModule // Opcional: Si otros módulos necesitan las entidades de pago directamente
  ]
})
export class PaymentsModule {} // Renombrado a PaymentsModule por convención (la clase principal del módulo)
