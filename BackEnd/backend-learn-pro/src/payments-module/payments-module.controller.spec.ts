import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsModuleController } from './payments-module.controller';
import { PaymentsModuleService } from './payments-module.service';

describe('PaymentsModuleController', () => {
  let controller: PaymentsModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsModuleController],
      providers: [PaymentsModuleService],
    }).compile();

    controller = module.get<PaymentsModuleController>(PaymentsModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
