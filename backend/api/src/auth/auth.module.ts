// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

// Importaciones de entidades y el factory para el patrón de diseño
import { Estudiante } from './entities/estudiante.entity';
import { Administrador } from './entities/administrador.entity';
import { UserFactory } from './factories/users.factory';

// Importamos el repositorio personalizado
import { EstudianteRepository } from './repositories/estudiante.repository';


@Module({
  imports: [
    // Registramos las entidades para que el módulo de TypeORM pueda gestionarlas
    TypeOrmModule.forFeature([Estudiante, Administrador]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserFactory, // Añadimos el UserFactory a los proveedores para que esté disponible en los servicios
    EstudianteRepository, // Añadimos el repositorio personalizado como proveedor
  ],
  exports: [
    AuthService,
    EstudianteRepository, // Exportamos el repositorio para que otros módulos puedan usarlo
  ],
})
export class AuthModule {}