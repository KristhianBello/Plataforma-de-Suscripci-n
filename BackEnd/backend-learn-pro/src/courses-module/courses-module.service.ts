import { Injectable } from '@nestjs/common';
import { CreateCoursesModuleDto } from './dto/create-courses-module.dto';
import { UpdateCoursesModuleDto } from './dto/update-courses-module.dto';

@Injectable()
export class CoursesModuleService {
  create(createCoursesModuleDto: CreateCoursesModuleDto) {
    return 'This action adds a new coursesModule';
  }

  findAll() {
    return `This action returns all coursesModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coursesModule`;
  }

  update(id: number, updateCoursesModuleDto: UpdateCoursesModuleDto) {
    return `This action updates a #${id} coursesModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} coursesModule`;
  }
}
