import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsModuleService } from './subscriptions-module.service';

describe('SubscriptionsModuleService', () => {
  let service: SubscriptionsModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsModuleService],
    }).compile();

    service = module.get<SubscriptionsModuleService>(SubscriptionsModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
