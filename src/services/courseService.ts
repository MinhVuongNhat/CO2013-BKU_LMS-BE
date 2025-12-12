// src/services/courseService.ts
import { apiClient } from './apiClient';
import { Course, Enrollment } from '../types';

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
  getAllCourses: async (): Promise<Course[]> => {
    const rawData = await apiClient.get<ApiCourseResponse[]>('courses');
    
    return rawData.map(item => ({
      id: item.CourseID,
      code: item.CourseID,
      name: item.Description,
      originalName: item.Name,
      credit: item.Credit,
      duration: item.Duration,
      deptId: item.DeptID,
      studentCount: 0 
    }));
  },

  getCourseById: async (id: string) => {
    return await apiClient.get<ApiCourseResponse>(`courses/${id}`);
  },

  createCourse: async (data: any) => {
    const payload = {
        CourseID: data.id,
        Name: data.originalName,
        Description: data.name,
        Credit: Number(data.credit),
        Duration: Number(data.duration),
        DeptID: data.deptId
    };
    // POST /courses
    return await apiClient.post('courses', payload);
  },

  updateCourse: async (id: string, data: any) => {
    const payload = {
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