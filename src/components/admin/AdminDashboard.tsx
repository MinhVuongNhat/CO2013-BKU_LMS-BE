import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, BookOpen, FileText, Activity } from 'lucide-react';
import { DEMO_USERS, DEMO_COURSES, DEMO_ASSIGNMENTS } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const totalUsers = DEMO_USERS.length;
  const students = DEMO_USERS.filter(u => u.role === 'Student').length;
  const teachers = DEMO_USERS.filter(u => u.role === 'Instructor').length;
  const admins = DEMO_USERS.filter(u => u.role === 'Admin').length;

  const userRoleData = [
    { name: 'Sinh viên', value: students, color: '#2F80ED' },
    { name: 'Giảng viên', value: teachers, color: '#27AE60' },
    { name: 'Quản trị viên', value: admins, color: '#E74C3C' }
  ];

  const activityData = [
    { month: 'T7', users: 65, courses: 12 },
    { month: 'T8', users: 75, courses: 15 },
    { month: 'T9', users: 85, courses: 18 },
    { month: 'T10', users: 98, courses: 20 },
    { month: 'T11', users: 110, courses: 22 },
    { month: 'T12', users: 125, courses: 25 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="uppercase text-primary text-3xl font-bold">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-1 italic">Quản trị BKU-LMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="text-primary font-bold">Lớp học</CardTitle>
            <BookOpen className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_COURSES.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold">Bài tập</CardTitle>
            <FileText className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_ASSIGNMENTS.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng số bài tập</p>
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
      <div className="grid md:grid-cols-2 gap-6">
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

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold">Hoạt động theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#9C050C" name="Người dùng" />
                <Line type="monotone" dataKey="courses" stroke="#132D65" name="Lớp học" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-primary font-bold">Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Tạo lớp học mới', user: 'Trần Thị Hương', time: '5 phút trước' },
              { action: 'Đăng ký tài khoản', user: 'Phạm Minh Tuấn', time: '15 phút trước' },
              { action: 'Nộp bài tập', user: 'Hoàng Thị Lan', time: '1 giờ trước' },
              { action: 'Tạo bài tập mới', user: 'Lê Văn Minh', time: '2 giờ trước' },
              { action: 'Chấm điểm bài tập', user: 'Trần Thị Hương', time: '3 giờ trước' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-bold text-destructive">{activity.action}</div>
                  <div className="text-sm text-primary">{activity.user}</div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
