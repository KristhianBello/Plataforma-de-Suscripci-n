"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
let CoursesService = class CoursesService {
    constructor() {
        this.courses = [
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
    }
    async findAll() {
        return this.courses;
    }
    async findById(id) {
        return this.courses.find(course => course.id === id);
    }
    async findByCategory(category) {
        return this.courses.filter(course => course.category.toLowerCase().includes(category.toLowerCase()));
    }
    async create(courseData) {
        const course = {
            id: Date.now().toString(),
            ...courseData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.courses.push(course);
        return course;
    }
    async update(id, updateData) {
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
    async delete(id) {
        const courseIndex = this.courses.findIndex(course => course.id === id);
        if (courseIndex === -1) {
            return false;
        }
        this.courses.splice(courseIndex, 1);
        return true;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)()
], CoursesService);
//# sourceMappingURL=courses.service.js.map