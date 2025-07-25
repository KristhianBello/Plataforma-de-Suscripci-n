// src/auth-module/auth-module.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModuleService } from './auth-module.service';
import { AuthModuleController } from './auth-module.controller';

// Importa tus entidades con las rutas correctas (minúsculas y .entity.ts)
import { Estudiante } from './entities/Estudiante'; //
import { Administrador } from './entities/Administrador'; //

// Importa y usa tu JwtStrategy
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // 1. Configuración de TypeORM para este módulo:
    TypeOrmModule.forFeature([Estudiante, Administrador]), //

    // 2. Configuración de Passport para NestJS:
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 3. Configuración del Módulo JWT (usando registerAsync para ConfigService):
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para que ConfigService esté disponible
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Obtiene el secreto de las variables de entorno
        signOptions: { expiresIn: '60m' }, // El token expirará en 60 minutos
      }),
      inject: [ConfigService], // Inyecta ConfigService en la factory
    }),
    ConfigModule, // Asegúrate de que ConfigModule esté disponible para toda la aplicación si no es global
  ],
  controllers: [AuthModuleController],
  providers: [
    AuthModuleService,
    JwtStrategy, // <-- ¡Ahora sí, registra tu estrategia JWT aquí!
  ],
  exports: [
    AuthModuleService,
    JwtModule,
    TypeOrmModule, // Para que otros módulos puedan usar las entidades del AuthModule si es necesario
    PassportModule // Para que otros módulos puedan usar los Guards de Passport (como JwtAuthGuard)
  ],
})
export class AuthModule {}