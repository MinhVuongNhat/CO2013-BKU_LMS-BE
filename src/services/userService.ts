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
    // Gọi API lấy dữ liệu thô
    const rawData = await apiClient.get<ApiUserResponse[]>('user');

    // Map (chuyển đổi) sang cấu trúc Frontend mong đợi
    return rawData.map((item) => {
      let mappedRole: 'admin' | 'teacher' | 'student' = 'student';
      if (item.UserID === 'USR000') mappedRole = 'admin';

      return {
        id: item.UserID,                                // Map UserID -> id
        name: `${item.LastName} ${item.FirstName}`.trim(), // Gộp họ tên -> name
        email: item.Email,                              // Giữ nguyên
        role: mappedRole,                               // Gán role giả lập
        phone: item.Phone,                              // Giữ nguyên
        // Các trường bổ sung nếu cần lưu lại để hiển thị chi tiết
        address: item.Address,
        dob: item.DoB,
        age: item.Age
      } as unknown as User; // Ép kiểu về User của frontend
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
    // Tách name thành FirstName/LastName nếu backend yêu cầu
    // Ở đây giả sử backend chấp nhận format nào đó, bạn cần check lại API tạo user yêu cầu field gì
    // Dưới đây là ví dụ gửi đúng format backend có vẻ mong đợi:
    
    const names = data.name.split(' ');
    const firstName = names.pop() || data.name;
    const lastName = names.join(' ');

    const payload = {
      // UserID: data.id, // Thường backend tự sinh ID
      FirstName: firstName,
      LastName: lastName,
      Email: data.email,
      Phone: data.phone,
      // Mật khẩu, Role hiện tại API JSON trả về không thấy có, 
      // nhưng khi tạo user thường sẽ cần gửi Password.
      // Password: data.password 
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