import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(@Query('category') category?: string): Promise<Course[]> {
    return this.coursesService.findAll(category);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Course | undefined> {
    return this.coursesService.findById(id);
  }

  @Post()
  async create(@Body() courseData: any): Promise<Course> {
    return this.coursesService.create(courseData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any): Promise<Course | undefined> {
    return this.coursesService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.coursesService.delete(id);
  }
}
