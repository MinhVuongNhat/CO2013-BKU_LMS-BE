// src/services/authService.ts

import { apiClient } from './apiClient';

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    accountId: string;
    userId: string;
    email: string;
    role: string; // "Admin", "Teacher", "Student"
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>('auth/login', { email, password });
  },
  
  logout: () => {
    // Xóa các key mà hệ thống đã lưu
    // Lưu ý: Cần khớp với key đã lưu trong LoginPage và AuthContext
    localStorage.removeItem('access_token');
    localStorage.removeItem('user'); 
    localStorage.removeItem('token'); // Xóa dự phòng nếu code cũ còn dùng
  },

  register: async (email: string, password: string, name: string, role: string): Promise<any> => {
    return await apiClient.post('auth/register', { email, password, name, role });
  },
};