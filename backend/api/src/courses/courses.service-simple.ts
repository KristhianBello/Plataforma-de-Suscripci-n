import { Injectable } from '@nestjs/common';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  instructor: string;
  isActive: boolean;
  imageUrl?: string;
  videoUrl?: string;
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
      duration: '20 horas',
      level: 'beginner',
      category: 'Programming',
      instructor: 'Juan Pérez',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'React Avanzado',
      description: 'Domina React con hooks, context y patrones avanzados',
      price: 49.99,
      duration: '35 horas',
      level: 'advanced',
      category: 'Programming',
      instructor: 'María García',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(category?: string): Promise<Course[]> {
    if (category) {
      return this.courses.filter(course => 
        course.category.toLowerCase().includes(category.toLowerCase()) && course.isActive
      );
    }
    return this.courses.filter(course => course.isActive);
  }

  async findById(id: string): Promise<Course | undefined> {
    return this.courses.find(course => course.id === id);
  }

  async findByCategory(category: string): Promise<Course[]> {
    return this.courses.filter(course => 
      course.category.toLowerCase().includes(category.toLowerCase()) && course.isActive
    );
  }

  async create(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const course: Course = {
      id: Date.now().toString(),
      ...courseData,
      isActive: true,
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