import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsModuleService } from './payments-module.service';

describe('PaymentsModuleService', () => {
  let service: PaymentsModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsModuleService],
    }).compile();

    service = module.get<PaymentsModuleService>(PaymentsModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
