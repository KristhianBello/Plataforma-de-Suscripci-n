import { Module } from '@nestjs/common';
import { PaymentsModuleService } from './payments-module.service';
import { PaymentsModuleController } from './payments-module.controller';

@Module({
  controllers: [PaymentsModuleController],
  providers: [PaymentsModuleService],
})
export class PaymentsModuleModule {}
