import { Module } from '@nestjs/common';
import { CoursesModuleService } from './courses-module.service';
import { CoursesModuleController } from './courses-module.controller';

@Module({
  controllers: [CoursesModuleController],
  providers: [CoursesModuleService],
})
export class CoursesModuleModule {}
