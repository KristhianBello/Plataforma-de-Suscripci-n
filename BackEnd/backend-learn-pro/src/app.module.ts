import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModuleModule } from './auth-module/auth-module.module';
import { UsersModuleModule } from './users-module/users-module.module';
import { CoursesModuleModule } from './courses-module/courses-module.module';
import { SubscriptionsModuleModule } from './subscriptions-module/subscriptions-module.module';
import { PaymentsModuleModule } from './payments-module/payments-module.module';
import { ProgressModuleModule } from './progress-module/progress-module.module';

@Module({
  imports: [AuthModuleModule, UsersModuleModule, CoursesModuleModule, SubscriptionsModuleModule, PaymentsModuleModule, ProgressModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
