import { Test, TestingModule } from '@nestjs/testing';
import { UsersModuleService } from './users-module.service';

describe('UsersModuleService', () => {
  let service: UsersModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersModuleService],
    }).compile();

    service = module.get<UsersModuleService>(UsersModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
