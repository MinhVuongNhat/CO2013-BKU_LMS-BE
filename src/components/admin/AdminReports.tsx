import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DEMO_USERS, DEMO_COURSES, DEMO_ASSIGNMENTS, DEMO_DOCUMENTS } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, FileText, TrendingUp, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';

export function AdminReports() {
  const [timeRange, setTimeRange] = useState('6months');

  const students = DEMO_USERS.filter(u => u.role === 'Student').length;
  const teachers = DEMO_USERS.filter(u => u.role === 'Instructor').length;
  const admins = DEMO_USERS.filter(u => u.role === 'Admin').length;

  const userRoleData = [
    { name: 'Sinh viên', value: students, color: '#032B91' },
    { name: 'Giảng viên', value: teachers, color: '#132D65' },
    { name: 'Quản trị', value: admins, color: '#9C050C' }
  ];

  const monthlyData = [
    { month: 'T7', users: 65, courses: 12, assignments: 25, documents: 30 },
    { month: 'T8', users: 75, courses: 15, assignments: 32, documents: 38 },
    { month: 'T9', users: 85, courses: 18, assignments: 38, documents: 45 },
    { month: 'T10', users: 98, courses: 20, assignments: 42, documents: 52 },
    { month: 'T11', users: 110, courses: 22, assignments: 48, documents: 58 },
    { month: 'T12', users: 125, courses: 25, assignments: 55, documents: 65 }
  ];

  const activityData = [
    { name: 'Đăng nhập', value: 1250 },
    { name: 'Nộp bài', value: 850 },
    { name: 'Xem tài liệu', value: 2100 },
    { name: 'Thảo luận', value: 420 },
    { name: 'Chấm điểm', value: 680 }
  ];

  const performanceData = DEMO_COURSES.map(course => ({
    name: course.code,
    students: course.studentCount,
    engagement: Math.floor(Math.random() * 30 + 70)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="uppercase text-primary text-3xl font-bold">Thống kê hệ thống</h1>
          <p className="text-muted-foreground mt-1 italic">Tổng quan và phân tích toàn hệ thống</p>
        </div>
        <div className="flex gap-2 bg-white">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="1month">1 tháng</SelectItem>
              <SelectItem value="3months">3 tháng</SelectItem>
              <SelectItem value="6months">6 tháng</SelectItem>
              <SelectItem value="1year">1 năm</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className=" bg-primary text-white font-bold">Xuất báo cáo</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold text-lg">Người dùng</CardTitle>
            <Users className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_USERS.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng tài khoản</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold text-lg">Lớp học</CardTitle>
            <BookOpen className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_COURSES.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold text-lg">Bài tập</CardTitle>
            <FileText className="w-6 h-6 text-primary"/>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_ASSIGNMENTS.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đã tạo</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold text-lg">Tài liệu</CardTitle>
            <FileText className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_DOCUMENTS.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đã upload</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary font-bold text-lg">Hoạt động</CardTitle>
            <Activity className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Phân bố người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Hoạt động trong tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#032B91" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card className="md:col-span-2 border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Xu hướng tăng trưởng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="##9C050C" name="Người dùng" strokeWidth={2} />
                <Line type="monotone" dataKey="courses" stroke="#032B91" name="Lớp học" strokeWidth={2} />
                <Line type="monotone" dataKey="assignments" stroke="#F59E0B" name="Bài tập" strokeWidth={2} />
                <Line type="monotone" dataKey="documents" stroke="#020817" name="Tài liệu" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card className="md:col-span-2 border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Hiệu quả lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#9C050C" name="Số sinh viên" />
                <Bar dataKey="engagement" fill="#032B91" name="Mức độ tham gia" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-2 gap-6 ">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Tổng quan người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sinh viên</span>
                <span>{students}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giảng viên</span>
                <span>{teachers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quản trị viên</span>
                <span>{admins}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-primary font-semibold">Tổng cộng</span>
                <span className="text-destructive text-xl font-bold">{DEMO_USERS.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Nội dung hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lớp học</span>
                <span>{DEMO_COURSES.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bài tập</span>
                <span>{DEMO_ASSIGNMENTS.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tài liệu</span>
                <span>{DEMO_DOCUMENTS.length}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-primary font-semibold">TB bài tập/lớp</span>
                <span className="text-destructive text-xl font-bold">
                  {(DEMO_ASSIGNMENTS.length / DEMO_COURSES.length).toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Hiệu suất hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-green-600">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response time</span>
                <span className="text-green-600">145ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active users</span>
                <span className="text-green-600">92</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-primary font-semibold">Trạng thái</span>
                <span className="text-destructive text-xl font-bold">Hoạt động tốt</span>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
