import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsModuleController } from './subscriptions-module.controller';
import { SubscriptionsModuleService } from './subscriptions-module.service';

describe('SubscriptionsModuleController', () => {
  let controller: SubscriptionsModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsModuleController],
      providers: [SubscriptionsModuleService],
    }).compile();

    controller = module.get<SubscriptionsModuleController>(SubscriptionsModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
