import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursesModuleService } from './courses-module.service';
import { CreateCoursesModuleDto } from './dto/create-courses-module.dto';
import { UpdateCoursesModuleDto } from './dto/update-courses-module.dto';

@Controller('courses-module')
export class CoursesModuleController {
  constructor(private readonly coursesModuleService: CoursesModuleService) {}

  @Post()
  create(@Body() createCoursesModuleDto: CreateCoursesModuleDto) {
    return this.coursesModuleService.create(createCoursesModuleDto);
  }

  @Get()
  findAll() {
    return this.coursesModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoursesModuleDto: UpdateCoursesModuleDto) {
    return this.coursesModuleService.update(+id, updateCoursesModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesModuleService.remove(+id);
  }
}
