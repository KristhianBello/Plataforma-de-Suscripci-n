import { Test, TestingModule } from '@nestjs/testing';
import { UsersModuleController } from './users-module.controller';
import { UsersModuleService } from './users-module.service';

describe('UsersModuleController', () => {
  let controller: UsersModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersModuleController],
      providers: [UsersModuleService],
    }).compile();

    controller = module.get<UsersModuleController>(UsersModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
