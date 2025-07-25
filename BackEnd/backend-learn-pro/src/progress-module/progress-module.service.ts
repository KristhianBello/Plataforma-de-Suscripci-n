import { Injectable } from '@nestjs/common';
import { CreateProgressModuleDto } from './dto/create-progress-module.dto';
import { UpdateProgressModuleDto } from './dto/update-progress-module.dto';

@Injectable()
export class ProgressModuleService {
  create(createProgressModuleDto: CreateProgressModuleDto) {
    return 'This action adds a new progressModule';
  }

  findAll() {
    return `This action returns all progressModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} progressModule`;
  }

  update(id: number, updateProgressModuleDto: UpdateProgressModuleDto) {
    return `This action updates a #${id} progressModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} progressModule`;
  }
}
