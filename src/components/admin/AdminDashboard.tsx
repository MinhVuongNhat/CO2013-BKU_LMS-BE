// src/components/admin/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, BookOpen, FileText, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { userService } from '../../services/userService';
import { courseService } from '../../services/courseService';
import { User, Course } from '../../types';

interface AdminDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, coursesData] = await Promise.all([
          userService.getAllUsers(),
          courseService.getAllCourses()
        ]);
        setUsers(usersData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalUsers = users.length;
  const admins = 4;
  const teachers = 7;
  const students = Math.max(users.length - admins - teachers, 0);
  const userRoleData = [
    { name: 'Sinh viên', value: students, color: '#2F80ED' },
    { name: 'Giảng viên', value: teachers, color: '#27AE60' },
    { name: 'Quản trị viên', value: admins, color: '#E74C3C' }
  ];


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="uppercase text-primary text-3xl font-bold">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-1 italic">Quản trị BKU-LMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-2 hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold">Người dùng</CardTitle>
            <Users className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng tài khoản</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold">Môn học</CardTitle>
            <BookOpen className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold">Hoạt động</CardTitle>
            <Activity className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Hệ thống ổn định</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold">Phân bố người dùng theo vai trò</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#9C050C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}