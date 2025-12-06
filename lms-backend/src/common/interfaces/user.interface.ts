export interface IUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;

  // RolesGuard
  role: 'admin' | 'instructor' | 'student' | 'system-admin' | 'sManager';

  // Optional fields
  phone?: string;
  address?: string;
  age?: number;
  dob?: Date;
}
