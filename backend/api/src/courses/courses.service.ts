import { Injectable } from '@nestjs/common';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // en horas
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CoursesService {
  private courses: Course[] = [
    {
      id: '1',
      title: 'Introducción a JavaScript',
      description: 'Aprende los fundamentos de JavaScript desde cero',
      price: 29.99,
      duration: 20,
      level: 'beginner',
      category: 'Programming',
      instructor: 'Juan Pérez',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'React Avanzado',
      description: 'Domina React con hooks, context y patrones avanzados',
      price: 49.99,
      duration: 35,
      level: 'advanced',
      category: 'Programming',
      instructor: 'María García',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(): Promise<Course[]> {
    return this.courses;
  }

  async findById(id: string): Promise<Course | undefined> {
    return this.courses.find(course => course.id === id);
  }

  async findByCategory(category: string): Promise<Course[]> {
    return this.courses.filter(course => 
      course.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  async create(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const course: Course = {
      id: Date.now().toString(),
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.courses.push(course);
    return course;
  }

  async update(id: string, updateData: Partial<Course>): Promise<Course | undefined> {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return undefined;
    }

    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return this.courses[courseIndex];
  }

  async delete(id: string): Promise<boolean> {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return false;
    }

    this.courses.splice(courseIndex, 1);
    return true;
  }
}
