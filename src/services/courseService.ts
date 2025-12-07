// src/services/courseService.ts
import { apiClient } from './apiClient';
import { Course, Enrollment } from '../types';

// Interface trả về từ API (Raw Data từ Backend)
interface ApiCourseResponse {
  CourseID: string;
  Name: string;        // Tên Tiếng Anh
  Description: string; // Tên Tiếng Việt
  Credit: number;
  Duration: number;
  DeptID: string;
}

interface ApiEnrollmentResponse {
  EnrollID: string;
  StudentID: string;
  CourseID: string;
  Status: string;
  Semester: string;
  GradeFinal: string;
  Schedule: string;
  InstructorID: string;
  StudentName: string;
  CourseName: string;
  InstructorName: string;
}

export const courseService = {
  // --- COURSES ---
  getAllCourses: async (): Promise<Course[]> => {
    const rawData = await apiClient.get<ApiCourseResponse[]>('courses');
    
    return rawData.map(item => ({
      id: item.CourseID,
      code: item.CourseID,
      name: item.Description, // Map Description -> Tên hiển thị (Tiếng Việt)
      originalName: item.Name, // Map Name -> Tên gốc (Tiếng Anh)
      credit: item.Credit,
      duration: item.Duration,
      deptId: item.DeptID,
      studentCount: 0 
    }));
  },

  getCourseById: async (id: string) => {
    return await apiClient.get<ApiCourseResponse>(`courses/${id}`);
  },

  // --- FIX LỖI TẠO MỚI TẠI ĐÂY ---
  createCourse: async (data: any) => {
    // data chính là formData từ AdminCourses.tsx
    const payload = {
        CourseID: data.id,       // <--- Quan trọng: Map data.id thành CourseID
        Name: data.originalName, // Tên Tiếng Anh
        Description: data.name,  // Tên Tiếng Việt
        Credit: Number(data.credit),   // Đảm bảo là số
        Duration: Number(data.duration), // Đảm bảo là số
        DeptID: data.deptId
    };
    // POST /courses
    return await apiClient.post('courses', payload);
  },

  // --- FIX LỖI CẬP NHẬT TẠI ĐÂY ---
  updateCourse: async (id: string, data: any) => {
    const payload = {
        // Khi update thường không gửi lại CourseID nếu đó là khóa chính
        Name: data.originalName,
        Description: data.name,
        Credit: Number(data.credit),
        Duration: Number(data.duration),
        DeptID: data.deptId
    };
    // PATCH /courses/:id
    return await apiClient.patch(`courses/${id}`, payload);
  },

  deleteCourse: async (id: string) => {
    return await apiClient.delete(`courses/${id}`);
  },

  // --- ENROLLMENTS ---
  getAllEnrollments: async (): Promise<Enrollment[]> => {
    const rawData = await apiClient.get<ApiEnrollmentResponse[]>('enrollments');
    
    return rawData.map(item => ({
      id: item.EnrollID,
      studentId: item.StudentID,
      courseId: item.CourseID,
      status: item.Status,
      semester: item.Semester,
      grade: item.GradeFinal,
      schedule: item.Schedule,
      instructorId: item.InstructorID,
      studentName: item.StudentName,
      courseName: item.CourseName,
      instructorName: item.InstructorName
    }));
  },

  getEnrollmentById: async (id: string) => {
    return await apiClient.get<ApiEnrollmentResponse>(`enrollments/${id}`);
  }
};