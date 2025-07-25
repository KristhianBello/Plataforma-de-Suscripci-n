import { Module } from '@nestjs/common';
import { SubscriptionsModuleService } from './subscriptions-module.service';
import { SubscriptionsModuleController } from './subscriptions-module.controller';

@Module({
  controllers: [SubscriptionsModuleController],
  providers: [SubscriptionsModuleService],
})
export class SubscriptionsModuleModule {}
