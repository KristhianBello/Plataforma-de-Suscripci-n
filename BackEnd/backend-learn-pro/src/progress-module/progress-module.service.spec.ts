import { Test, TestingModule } from '@nestjs/testing';
import { ProgressModuleService } from './progress-module.service';

describe('ProgressModuleService', () => {
  let service: ProgressModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressModuleService],
    }).compile();

    service = module.get<ProgressModuleService>(ProgressModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
