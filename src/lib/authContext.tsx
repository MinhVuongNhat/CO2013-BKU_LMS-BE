import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (userData: any) => void;
  logout: () => void;
  register: (data: any) => void;
  updateUser: (userData: User) => void; // Thêm hàm update user
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user từ localStorage nếu có
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: any) => {
    
    // Map userData từ login response sang User type
    const mappedUser: User = {
      id: userData.userId || userData.id || userData.UserID,
      email: userData.email,
      name: userData.name || userData.email,
      role: userData.role || 'Student',
      studentId: userData.studentId,
      teacherId: userData.teacherId,
      phone: userData.phone,
      address: userData.address,
      age: userData.age,
      dob: userData.dob
    };

    setUser(mappedUser);
    localStorage.setItem("user", JSON.stringify(mappedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
  };

  const register = (data: any) => {
    const mappedUser: User = {
      id: data.userId || data.id,
      email: data.email,
      name: data.name,
      role: data.role || 'Student',
      studentId: data.studentId,
      teacherId: data.teacherId,
      phone: data.phone,
      address: data.address,
      age: data.age,
      dob: data.dob
    };

    setUser(mappedUser);
    localStorage.setItem("user", JSON.stringify(mappedUser));
  };

  // Hàm cập nhật user trong context (sau khi edit profile)
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}