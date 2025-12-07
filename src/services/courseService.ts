// src/services/courseService.ts
import { apiClient } from './apiClient';
import { Course, Enrollment } from '../types';

// Interface trả về từ API (Raw Data)
interface ApiCourseResponse {
  CourseID: string;
  Name: string;
  Description: string;
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
      // Yêu cầu: Dùng Description làm tên môn học
      name: item.Description, 
      // Lưu lại tên gốc (tiếng Anh) để hiển thị phụ
      originalName: item.Name, 
      credit: item.Credit,
      duration: item.Duration,
      deptId: item.DeptID,
      studentCount: 0 // Sẽ tính toán sau khi lấy enrollment
    }));
  },

  getCourseById: async (id: string) => {
    return await apiClient.get<ApiCourseResponse>(`courses/${id}`);
  },

  createCourse: async (data: any) => {
    // Map ngược lại khi tạo mới
    const payload = {
        // CourseID: backend tự sinh hoặc frontend nhập
        Name: data.originalName,
        Description: data.name,
        Credit: Number(data.credit),
        Duration: Number(data.duration),
        DeptID: data.deptId
    };
    return await apiClient.post('courses', payload);
  },

  updateCourse: async (id: string, data: any) => {
    return await apiClient.patch(`courses/${id}`, data);
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