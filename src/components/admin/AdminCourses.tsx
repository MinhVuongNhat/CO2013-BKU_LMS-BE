import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Lock, Unlock, Trash2, Eye, Users } from 'lucide-react';
import { DEMO_COURSES, COURSE_ENROLLMENTS } from '../../lib/mockData';

export function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = DEMO_COURSES.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="uppercase text-primary text-3xl font-bold">Quản lý lớp học</h1>
        <p className="text-muted-foreground mt-1 italic">Xem và quản lý tất cả lớp học trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">Tổng lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_COURSES.length}</div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{DEMO_COURSES.length}</div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">Tổng sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {DEMO_COURSES.reduce((sum, c) => sum + c.studentCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">TB SV/lớp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {Math.round(DEMO_COURSES.reduce((sum, c) => sum + c.studentCount, 0) / DEMO_COURSES.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          placeholder="Tìm kiếm lớp học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-primary font-bold text-lg">Danh sách lớp học (Số lượng: {filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-white font-bold ">Mã lớp</TableHead>
                <TableHead className="text-white font-bold ">Tên lớp</TableHead>
                <TableHead className="text-white font-bold ">Giảng viên</TableHead>
                <TableHead className="text-white font-bold ">Học kỳ</TableHead>
                <TableHead className="text-white font-bold ">Số SV</TableHead>
                <TableHead className="text-white font-bold ">Mã đăng ký</TableHead>
                <TableHead className="text-white font-bold ">Trạng thái</TableHead>
                <TableHead className="text-right text-white font-bold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map(course => (
                <TableRow key={course.id}
                  className="even:bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  <TableCell className="text-destructive font-bold">{course.code}</TableCell>
                  <TableCell className="font-semibold italic">{course.name}</TableCell>
                  <TableCell className="text-primary font-bold">{course.teacherName}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-destructive" />
                      <span className="text-destructive font-bold">{course.studentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm rounded font-semibold">{course.enrollmentCode}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Hoạt động</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Lock className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy lớp học nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Lớp học theo giảng viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(DEMO_COURSES.map(c => c.teacherName))).map(teacher => {
                const courses = DEMO_COURSES.filter(c => c.teacherName === teacher);
                return (
                  <div key={teacher} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-grey">
                    <div>
                      <div className="text-destructive font-bold">{teacher}</div>
                      <div className="text-sm text-muted-foreground">{courses.length} lớp học</div>
                    </div>
                    <Badge>{courses.reduce((sum, c) => sum + c.studentCount, 0)} SV</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Lớp học theo học kỳ</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="space-y-3">
              {Array.from(new Set(DEMO_COURSES.map(c => c.semester))).map(semester => {
                const courses = DEMO_COURSES.filter(c => c.semester === semester);
                return (
                  <div key={semester} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-grey">
                    <div>
                      <div className="text-destructive font-bold">{semester}</div>
                      <div className="text-sm text-muted-foreground">{courses.length} lớp học</div>
                    </div>
                    <Badge>{courses.reduce((sum, c) => sum + c.studentCount, 0)} SV</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
