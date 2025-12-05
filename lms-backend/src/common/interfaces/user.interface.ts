export interface IUser {
  userId: string;         // Mã UserID hoặc StudentID/InstructorID/AdminID
  email: string;
  firstName: string;
  lastName: string;

  // role dùng cho RBAC (RolesGuard)
  role: 'admin' | 'instructor' | 'student' | 'system-admin' | 'sManager';

  // Optional fields
  phone?: string;
  address?: string;
  age?: number;
  dob?: Date;
}
