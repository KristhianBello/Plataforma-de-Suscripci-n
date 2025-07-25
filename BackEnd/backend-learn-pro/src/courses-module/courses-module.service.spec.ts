import { Test, TestingModule } from '@nestjs/testing';
import { CoursesModuleService } from './courses-module.service';

describe('CoursesModuleService', () => {
  let service: CoursesModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesModuleService],
    }).compile();

    service = module.get<CoursesModuleService>(CoursesModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
