import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PruebaModule } from './prueba/prueba.module';
import { AdministradorModule } from './administrador/administrador.module';
import { EstudianteModule } from './estudiante/estudiante.module';

@Module({
  imports: [PruebaModule, AdministradorModule, EstudianteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
