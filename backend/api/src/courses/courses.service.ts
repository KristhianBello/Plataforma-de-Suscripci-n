import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(category?: string): Promise<Course[]> {
    if (category) {
      return await this.courseRepository.find({
        where: { category, isActive: true },
      });
    }
    return await this.courseRepository.find({
      where: { isActive: true },
    });
  }

  async findById(id: string): Promise<Course | undefined> {
    return await this.courseRepository.findOne({ where: { id } });
  }

  async findByCategory(category: string): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { category, isActive: true },
    });
  }

  async create(courseData: any): Promise<Course> {
    const course = this.courseRepository.create(courseData);
    return await this.courseRepository.save(course) as unknown as Course;
  }

  async update(id: string, updateData: Partial<Course>): Promise<Course | undefined> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      return undefined;
    }

    Object.assign(course, updateData);
    return await this.courseRepository.save(course) as unknown as Course;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.courseRepository.delete(id);
    return result.affected > 0;
  }
}
