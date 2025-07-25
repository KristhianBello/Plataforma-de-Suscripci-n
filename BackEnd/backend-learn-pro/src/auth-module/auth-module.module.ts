// src/auth-module/auth-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule
import { JwtModule } from '@nestjs/jwt';       // Importa JwtModule
import { PassportModule } from '@nestjs/passport'; // Importa PassportModule (necesario para las estrategias JWT)

import { AuthModuleService } from './auth-module.service';
import { AuthModuleController } from './auth-module.controller';

// Importa tus entidades
import { Estudiante } from './entities/Estudiante';
import { Administrador } from './entities/Administrador';

// Opcional: Si ya tienes definida tu JwtStrategy (que es el siguiente paso después del módulo)
// import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    // Registra las entidades que este módulo utilizará para interactuar con la base de datos.
    TypeOrmModule.forFeature([Estudiante, Administrador]),

    // 2. Configuración de Passport para NestJS:
    // Proporciona el mecanismo principal para autenticación.
    PassportModule.register({ defaultStrategy: 'jwt' }), // Define 'jwt' como estrategia por defecto

    // 3. Configuración del Módulo JWT:
    // Aquí se define la clave secreta y las opciones para firmar y verificar tokens JWT.
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'TU_SECRETO_JWT_SUPER_SEGURO_Y_LARGO', // ¡¡IMPORTANTE: Usa una variable de entorno en producción!!
      signOptions: { expiresIn: '60m' }, // El token expirará en 60 minutos
    }),
  ],
  controllers: [AuthModuleController],
  providers: [
    AuthModuleService,
    // Opcional: Si ya tienes definida tu JwtStrategy, la registras aquí.
    // JwtStrategy,
  ],
  // Exporta lo que otros módulos puedan necesitar usar de AuthModule.
  // Es común exportar JwtModule y AuthModuleService para que otros módulos puedan verificar tokens
  // o utilizar los servicios de autenticación sin volver a configurarlos.
  exports: [
    AuthModuleService,
    JwtModule, // Exporta JwtModule para que otros módulos puedan verificar tokens
    TypeOrmModule // Opcional: Si otros módulos necesitan las entidades de AuthModule directamente
  ],
})
export class AuthModule {} // Renombrado a AuthModule para convención