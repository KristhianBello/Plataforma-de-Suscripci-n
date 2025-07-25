// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importaciones para la configuración de la base de datos
import { TypeOrmModule } from '@nestjs/typeorm'; // Para integrar TypeORM
import { ConfigModule, ConfigService } from '@nestjs/config'; // Para gestionar variables de entorno

// Importa tus módulos de la aplicación
import { AuthModule } from './auth-module/auth-module.module';
import { UsersModuleModule } from './users-module/users-module.module'; // Renombrado a UsersModule
import { CoursesModuleModule } from './courses-module/courses-module.module'; // Renombrado a CoursesModule
import { SubscriptionsModuleModule } from './subscriptions-module/subscriptions-module.module'; // Renombrado a SubscriptionsModule
import { PaymentsModuleModule } from './payments-module/payments-module.module'; // Renombrado a PaymentsModule
import { ProgressModuleModule } from './progress-module/progress-module.module'; // Renombrado a ProgressModule

// Importa tus entidades globales o las que TypeORM necesita conocer desde el inicio
// Asegúrate de que todas tus entidades (Estudiante, Administrador, Curso, Suscripcion, Pago, Notificacion)
// estén listadas aquí o que TypeORM las descubra automáticamente.
import { Estudiante } from './auth-module/entities/Estudiante';
import { Administrador } from './auth-module/entities/Administrador';
// Importa las entidades de otros módulos aquí a medida que las crees
// import { Curso } from './courses-module/entities/curso.entity';
// import { Suscripcion } from './subscriptions-module/entities/suscripcion.entity';
// import { Pago } from './payments-module/entities/pago.entity';
// import { Notificacion } from './notifications-module/entities/notificacion.entity';


@Module({
  imports: [
    // 1. Configuración del Módulo de Configuración (para variables de entorno)
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
      envFilePath: '.env', // Asegúrate de tener un archivo .env en la raíz de tu proyecto
    }),

    // 2. Configuración de TypeORM para la conexión a la base de datos (Supabase/PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para poder usar ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres', // Tipo de base de datos
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          // Lista todas tus entidades aquí para que TypeORM las mapee.
          // A medida que crees más entidades en otros módulos, añádelas aquí.
          Estudiante,
          Administrador,
          // Curso,
          // Suscripcion,
          // Pago,
          // Notificacion,
        ],
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE') || false, // ¡CUIDADO EN PRODUCCIÓN!
        logging: configService.get<boolean>('DATABASE_LOGGING') || false, // Habilita logs de SQL (útil para depuración)
        ssl: configService.get<boolean>('DATABASE_SSL') === true ? {
          rejectUnauthorized: configService.get<boolean>('DATABASE_SSL_REJECT_UNAUTHORIZED') || false, // Para Supabase, a veces es necesario false en desarrollo si hay problemas con certificados
        } : false, // Deshabilita SSL si DATABASE_SSL no es true
      }),
      inject: [ConfigService], // Inyecta ConfigService en la factory
    }),

    // Tus módulos de la aplicación
    AuthModule,
    UsersModuleModule, // Renombrado a UsersModule
    CoursesModuleModule, // Renombrado a CoursesModule
    SubscriptionsModuleModule, // Renombrado a SubscriptionsModule
    PaymentsModuleModule, // Renombrado a PaymentsModule
    ProgressModuleModule, // Renombrado a ProgressModule
    // Si tienes un NotificationsModule, impórtalo aquí también
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}