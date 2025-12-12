// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Instructor' | 'Student';
  phone?: string;
  studentId?: string;
  teacherId?: string;
  address?: string;
  age?: number;
  dob?: string;
}

export interface Course {
  id: string;
  name: string;
  originalName: string;
  code: string;
  credit: number;
  duration: number;
  deptId: string;
  studentCount?: number; 
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: string;
  semester: string;
  grade: string;
  schedule: string;
  instructorId: string;
  studentName: string;
  courseName: string;
  instructorName: string;
}