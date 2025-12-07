// src/services/userService.ts
import { apiClient } from './apiClient';
import { User } from '../types';

// Định nghĩa kiểu dữ liệu trả về từ API
interface ApiUserResponse {
  UserID: string;
  LastName: string;
  FirstName: string;
  Email: string;
  Phone: string;
  Address: string;
  Age: number;
  DoB: string;
  Role?: string; // Có thể có từ API
  StudentID?: string;
  TeacherID?: string;
}

// Interface cho Account response (nếu cần)
interface ApiAccountResponse {
  AccountID: string;
  UserID: string;
  Email: string;
  Role: string; // Admin, Instructor, Student
}

export const userService = {
  // Helper: Lấy Role từ bảng Account (nếu API User không trả về)
  getUserRole: async (userId: string): Promise<'Admin' | 'Instructor' | 'Student'> => {
    try {
      // Thử gọi API account nếu có
      const accountData = await apiClient.get<ApiAccountResponse>(`account/${userId}`);
      const r = accountData.Role.toLowerCase();
      if (r === 'admin') return 'Admin';
      if (r === 'teacher' || r === 'instructor') return 'Instructor';
      return 'Student';
    } catch (error) {
      // Fallback nếu không có API account
      console.warn('Cannot fetch role from account, using ID-based logic');
      const numericID = parseInt(userId.replace("USR", ""), 10);
      if (!isNaN(numericID)) {
        if (numericID <= 2) return 'Admin';
        if (numericID <= 10) return 'Instructor';
      }
      return 'Student';
    }
  },

  // GET /user
  getAllUsers: async (): Promise<User[]> => {
    const rawData = await apiClient.get<ApiUserResponse[]>('user');

    return rawData.map((item) => {
      const userId = item.UserID || (item as any).id || '';

      // Logic Role
      let mappedRole: 'Admin' | 'Instructor' | 'Student' = 'Student';
      
      if (item.Role) {
         const r = item.Role.toLowerCase();
         if (r === 'admin') mappedRole = 'Admin';
         else if (r === 'teacher' || r === 'instructor') mappedRole = 'Instructor';
         else mappedRole = 'Student';
      } else {
         // Fallback
         try {
             const numericID = parseInt(userId.replace("USR", ""), 10);
             if (!isNaN(numericID)) {
                 if (numericID < 4) mappedRole = 'Admin';
                 else if (numericID < 11) mappedRole = 'Instructor';
             }
         } catch (e) {}
      }

      return {
        id: userId,
        name: `${item.LastName || ''} ${item.FirstName || ''}`.trim(),
        email: item.Email,
        role: mappedRole,
        phone: item.Phone,
        address: item.Address,
        dob: item.DoB,
        age: item.Age,
        studentId: item.StudentID,
        teacherId: item.TeacherID
      } as User;
    });
  },

  // GET /user/:id
  getUserById: async (id: string) => {
    const item = await apiClient.get<ApiUserResponse>(`user/${id}`);
    
    // Lấy Role từ API nếu có
    let mappedRole: 'Admin' | 'Instructor' | 'Student' = 'Student';
    
    if (item.Role) {
      // API trả về Role trực tiếp
      const r = item.Role.toLowerCase();
      if (r === 'admin') mappedRole = 'Admin';
      else if (r === 'teacher' || r === 'instructor') mappedRole = 'Instructor';
      else mappedRole = 'Student';
    } else {
      // Fallback: Dựa vào UserID
      // USR000-USR002: Admin
      // USR003-USR010: Instructor  
      // USR011+: Student
      try {
        const numericID = parseInt(item.UserID.replace("USR", ""), 10);
        if (!isNaN(numericID)) {
          if (numericID <= 2) mappedRole = 'Admin';
          else if (numericID <= 10) mappedRole = 'Instructor';
          else mappedRole = 'Student';
        }
      } catch (e) {
        console.error('Error parsing UserID:', e);
      }
    }

    return {
      id: item.UserID,
      name: `${item.LastName} ${item.FirstName}`.trim(),
      email: item.Email,
      role: mappedRole,
      phone: item.Phone,
      address: item.Address,
      dob: item.DoB,
      age: item.Age,
      studentId: (item as any).StudentID,
      teacherId: (item as any).TeacherID
    } as User;
  },

  // POST /user
  createUser: async (data: any) => {
    const names = data.name.trim().split(' ');
    let firstName = data.name;
    let lastName = '';

    if (names.length > 1) {
      firstName = names.pop();
      lastName = names.join(' ');
    }

    let calculatedAge = null;
    if (data.dob) {
      const birthDate = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age;
    }

    const payload = {
      FirstName: firstName,
      LastName: lastName,
      Email: data.email,
      Phone: data.phone,
      Address: data.address,
      DoB: data.dob,
      Age: calculatedAge,
      StudentID: data.role === 'Student' ? data.studentId : null,
      TeacherID: data.role === 'Instructor' ? data.teacherId : null
    };

    return await apiClient.post('user', payload);
  },

  // PATCH /user/:id
  updateUser: async (id: string, data: any) => {
    if (!id) {
      throw new Error("User ID is missing");
    }

    // 1. Tách tên
    let firstName = undefined;
    let lastName = undefined;
    if (data.name) {
      const names = data.name.trim().split(' ');
      if (names.length > 1) {
        firstName = names.pop();
        lastName = names.join(' ');
      } else {
        firstName = data.name;
        lastName = "";
      }
    }

    // 2. TẠO PAYLOAD SẠCH
    const apiPayload: any = {};

    if (firstName !== undefined) apiPayload.FirstName = firstName;
    if (lastName !== undefined) apiPayload.LastName = lastName;
    if (data.phone !== undefined) apiPayload.Phone = data.phone;
    if (data.address !== undefined) apiPayload.Address = data.address;
    
    // FIX: Chuyển đổi date từ ISO sang YYYY-MM-DD
    if (data.dob !== undefined && data.dob !== '') {
      try {
        // Nếu đã là YYYY-MM-DD thì giữ nguyên
        if (/^\d{4}-\d{2}-\d{2}$/.test(data.dob)) {
          apiPayload.DoB = data.dob;
        } else {
          // Chuyển đổi ISO hoặc format khác sang YYYY-MM-DD
          const date = new Date(data.dob);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          apiPayload.DoB = `${year}-${month}-${day}`;
        }
      } catch (e) {
        // Không gửi DoB nếu parse lỗi
      }
    }
    
    if (data.email !== undefined) apiPayload.Email = data.email;

    console.log(`Updating User ${id} with:`, apiPayload);

    return await apiClient.patch(`user/${id}`, apiPayload);
  },

  deleteUser: async (id: string) => {
    return await apiClient.delete<void>(`user/${id}`);
  }
};