import { Module } from '@nestjs/common';
import { ProgressModuleService } from './progress-module.service';
import { ProgressModuleController } from './progress-module.controller';

@Module({
  controllers: [ProgressModuleController],
  providers: [ProgressModuleService],
})
export class ProgressModuleModule {}
