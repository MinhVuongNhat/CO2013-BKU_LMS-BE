// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Instructor' | 'Student';
  phone?: string;
  studentId?: string;
  teacherId?: string;
  // Bổ sung các trường từ API
  address?: string;
  age?: number;
  dob?: string; // Date of Birth
}

export interface Course {
  id: string;           // Map từ CourseID
  name: string;         // Map từ Description (Theo yêu cầu của bạn)
  originalName: string; // Map từ Name (Tên tiếng Anh)
  code: string;         // Map từ CourseID để hiển thị mã
  credit: number;
  duration: number;
  deptId: string;
  // Các trường tính toán ở frontend
  studentCount?: number; 
}

export interface Enrollment {
  id: string;           // Map từ EnrollID
  studentId: string;
  courseId: string;
  status: string;
  semester: string;
  grade: string;        // GradeFinal
  schedule: string;
  instructorId: string;
  studentName: string;
  courseName: string;
  instructorName: string;
}