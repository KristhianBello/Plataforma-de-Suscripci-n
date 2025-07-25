import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersModuleService } from './users-module.service';
import { CreateUsersModuleDto } from './dto/change-password.dto.ts';
import { UpdateUsersModuleDto } from './dto/update-users-module.dto';

@Controller('users-module')
export class UsersModuleController {
  constructor(private readonly usersModuleService: UsersModuleService) {}

  @Post()
  create(@Body() createUsersModuleDto: CreateUsersModuleDto) {
    return this.usersModuleService.create(createUsersModuleDto);
  }

  @Get()
  findAll() {
    return this.usersModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersModuleDto: UpdateUsersModuleDto) {
    return this.usersModuleService.update(+id, updateUsersModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersModuleService.remove(+id);
  }
}
