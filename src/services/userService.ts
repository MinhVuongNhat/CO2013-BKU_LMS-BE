// src/services/userService.ts
import { apiClient } from './apiClient';
import { User } from '../types';

// 1. Định nghĩa kiểu dữ liệu thô (Raw) trả về từ API
// Đây là cấu trúc chính xác giống JSON bạn cung cấp
interface ApiUserResponse {
  UserID: string;
  LastName: string;
  FirstName: string;
  Email: string;
  Phone: string;
  Address: string;
  Age: number;
  DoB: string;
  // Lưu ý: API của bạn hiện tại KHÔNG trả về 'role', 'password', 'avatar'
}

export const userService = {
  // GET /user - Lấy danh sách và Mapping lại tên trường
  getAllUsers: async (): Promise<User[]> => {
    const rawData = await apiClient.get<ApiUserResponse[]>('user');

    return rawData.map((item) => {
      // Lấy số index từ UserID, ví dụ: "USR007" -> 7
      const numericID = parseInt(item.UserID.replace("USR", ""), 10);

      let mappedRole: 'admin' | 'teacher' | 'student' = 'student';

      if (numericID < 4) mappedRole = 'admin';          // USR000 → USR003
      else if (numericID < 11) mappedRole = 'teacher';  // USR004 → USR010

      return {
        id: item.UserID,
        name: `${item.LastName} ${item.FirstName}`.trim(),
        email: item.Email,
        role: mappedRole,
        phone: item.Phone,
        address: item.Address,
        dob: item.DoB,
        age: item.Age
      } as unknown as User;
    });
  },

  // GET /user/:id
  getUserById: async (id: string) => {
    const item = await apiClient.get<ApiUserResponse>(`user/${id}`);

    // Cũng phải map cho api này
    return {
      id: item.UserID,
      name: `${item.LastName} ${item.FirstName}`.trim(),
      email: item.Email,
      role: 'student', // Tạm thời để student
      phone: item.Phone,
    } as unknown as User;
  },

  // POST /user - Khi tạo mới, cần chuyển đổi ngược từ Frontend -> Backend format
  createUser: async (data: any) => {
    // 1. Xử lý tách Họ và Tên an toàn
    const names = data.name.trim().split(' ');
    let firstName = data.name;
    let lastName = '';

    if (names.length > 1) {
      firstName = names.pop();    // Lấy từ cuối cùng làm Tên
      lastName = names.join(' '); // Các từ còn lại là Họ & Đệm
    }

    let calculatedAge = null;
    if (data.dob) {
      const birthDate = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      // Điều chỉnh nếu chưa tới sinh nhật trong năm nay
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age;
    }

    // 2. Tạo Payload chuẩn PascalCase theo Backend
    const payload = {
      // UserID: Thường Backend tự sinh, không gửi từ đây
      FirstName: firstName,
      LastName: lastName,
      Email: data.email,
      Phone: data.phone,
      Address: data.address,
      DoB: data.dob,
      Age: calculatedAge,

      // Logic gửi ID riêng: Chỉ gửi ID tương ứng với Role, ngược lại là null
      StudentID: data.role === 'Student' ? data.studentId : null,
      TeacherID: data.role === 'Instructor' ? data.teacherId : null
    };

    return await apiClient.post('user', payload);
  },
  // PATCH /user/:id
  updateUser: async (id: string, data: any) => {
    // Tương tự, nếu sửa tên thì phải tách ra
    const payload: any = { ...data };

    if (data.name) {
      const names = data.name.split(' ');
      payload.FirstName = names.pop();
      payload.LastName = names.join(' ');
      delete payload.name; // Xóa trường name thừa
    }

    if (data.phone) {
      payload.Phone = data.phone;
      delete payload.phone;
    }

    return await apiClient.patch(`user/${id}`, payload);
  },

  deleteUser: async (id: string) => {
    return await apiClient.delete<void>(`user/${id}`);
  }
};