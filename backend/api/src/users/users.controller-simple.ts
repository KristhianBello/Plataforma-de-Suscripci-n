import { Controller, Get, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { UsersService } from './users.service';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user?.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any): Promise<User | undefined> {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
