import { Test, TestingModule } from '@nestjs/testing';
import { ProgressModuleController } from './progress-module.controller';
import { ProgressModuleService } from './progress-module.service';

describe('ProgressModuleController', () => {
  let controller: ProgressModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressModuleController],
      providers: [ProgressModuleService],
    }).compile();

    controller = module.get<ProgressModuleController>(ProgressModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
