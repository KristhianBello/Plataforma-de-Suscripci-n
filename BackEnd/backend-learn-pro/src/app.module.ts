import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PruebaModule } from './prueba/prueba.module';

@Module({
  imports: [PruebaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
