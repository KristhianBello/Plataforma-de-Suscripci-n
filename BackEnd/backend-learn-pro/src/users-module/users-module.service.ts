import { Injectable } from '@nestjs/common';
import { CreateUsersModuleDto } from './dto/create-users-module.dto';
import { UpdateUsersModuleDto } from './dto/update-users-module.dto';

@Injectable()
export class UsersModuleService {
  create(createUsersModuleDto: CreateUsersModuleDto) {
    return 'This action adds a new usersModule';
  }

  findAll() {
    return `This action returns all usersModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersModule`;
  }

  update(id: number, updateUsersModuleDto: UpdateUsersModuleDto) {
    return `This action updates a #${id} usersModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersModule`;
  }
}
