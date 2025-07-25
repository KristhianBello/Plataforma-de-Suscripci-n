import { Test, TestingModule } from '@nestjs/testing';
import { CoursesModuleController } from './courses-module.controller';
import { CoursesModuleService } from './courses-module.service';

describe('CoursesModuleController', () => {
  let controller: CoursesModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesModuleController],
      providers: [CoursesModuleService],
    }).compile();

    controller = module.get<CoursesModuleController>(CoursesModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
