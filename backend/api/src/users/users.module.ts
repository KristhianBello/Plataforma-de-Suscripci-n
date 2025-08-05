import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Estudiante } from '../auth/entities/estudiante.entity';
import { Administrador } from '../auth/entities/administrador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Administrador]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
