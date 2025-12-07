import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Lock, Trash2, Eye, Users, BookOpen, Calendar, User, Clock, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';

// Import Services & Types
import { courseService } from '../../services/courseService';
import { Course, Enrollment } from '../../types';

export function AdminCourses() {
  // Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog States
  const [courseDetailOpen, setCourseDetailOpen] = useState(false); // Danh sách enrollment của 1 course
  const [enrollmentDetailOpen, setEnrollmentDetailOpen] = useState(false); // Chi tiết 1 enrollment
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      // setIsLoading(true); // Có thể bật nếu muốn loading mỗi lần refresh
      const [coursesData, enrollmentsData] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getAllEnrollments()
      ]);

      // Tính toán số lượng sinh viên cho từng khóa học
      const coursesWithCount = coursesData.map(course => {
        const count = enrollmentsData.filter(e => e.courseId === course.id).length;
        return { ...course, studentCount: count };
      });

      setCourses(coursesWithCount);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải dữ liệu khóa học');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logic
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logic hiển thị danh sách enrollments của course đang chọn
  const courseEnrollments = selectedCourse 
    ? enrollments.filter(e => e.courseId === selectedCourse.id)
    : [];

  // Handlers
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseDetailOpen(true);
  };

  const handleViewEnrollmentDetail = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setEnrollmentDetailOpen(true);
  };

  // Helper render status badge
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return <Badge className="bg-green-600 hover:bg-green-700">Hoàn thành</Badge>;
    if (s === 'in progress') return <Badge className="bg-blue-600 hover:bg-blue-700">Đang học</Badge>;
    if (s === 'dropped') return <Badge variant="destructive">Đã hủy</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải dữ liệu khóa học...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="uppercase text-primary text-3xl font-bold">Quản lý khóa học</h1>
        <p className="text-muted-foreground mt-1 italic">Xem và quản lý tất cả lớp học trong hệ thống</p>
      </div>

      {/* Stats - Tính toán từ dữ liệu thật */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">Tổng khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">Tổng lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>
        {/* <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">Tổng tín chỉ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {courses.reduce((sum, c) => sum + c.credit, 0)}
            </div>
          </CardContent>
        </Card> */}
        <Card className="border-2 items-center hover:border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary font-bold">TB SV/Lớp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {courses.length > 0 ? Math.round(enrollments.length / courses.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          placeholder="Tìm kiếm theo tên môn học, mã môn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-primary font-bold text-lg">Danh sách khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-white font-bold w-[100px]">Mã MH</TableHead>
                <TableHead className="text-white font-bold">Tên môn học (VN)</TableHead>
                <TableHead className="text-white font-bold">Tên gốc (EN)</TableHead>
                <TableHead className="text-white font-bold">Khoa</TableHead>
                <TableHead className="text-white font-bold text-center">Tín chỉ</TableHead>
                <TableHead className="text-white font-bold text-center">Số lớp</TableHead>
                <TableHead className="text-right text-white font-bold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map(course => (
                <TableRow 
                  key={course.id}
                  className="even:bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewCourse(course)}
                >
                  <TableCell className="text-destructive font-bold">{course.id}</TableCell>
                  <TableCell className="font-semibold text-primary">{course.name}</TableCell>
                  <TableCell className="italic text-muted-foreground">{course.originalName}</TableCell>
                  <TableCell>{course.deptId}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-primary text-primary">{course.credit}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-destructive" />
                      <span className="text-destructive font-bold">{course.studentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={(e) => {
                        e.stopPropagation();
                        handleViewCourse(course);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => e.stopPropagation()}>
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

      {/* DIALOG 1: Danh sách Enrollment của Course */}
      <Dialog open={courseDetailOpen} onOpenChange={setCourseDetailOpen}>
        <DialogContent className="max-w-[1000px] sm:max-w-[1000px] max-h-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold text-xl flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {selectedCourse?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              <span className="font-semibold text-destructive">{selectedCourse?.originalName}</span>
              <span className="mx-2">•</span> 
              Mã: {selectedCourse?.id}
              <span className="mx-2">•</span> 
              Tín chỉ: {selectedCourse?.credit}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Danh sách lớp học (Enrollments)
            </h3>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="font-bold">Mã lớp</TableHead>
                    <TableHead className="font-bold">Sinh viên</TableHead>
                    <TableHead className="font-bold">Giảng viên</TableHead>
                    <TableHead className="font-bold">Học kỳ</TableHead>
                    <TableHead className="font-bold">Lịch học</TableHead>
                    <TableHead className="font-bold text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseEnrollments.length > 0 ? (
                    courseEnrollments.map((enrollment) => (
                      <TableRow 
                        key={enrollment.id} 
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleViewEnrollmentDetail(enrollment)}
                      >
                        <TableCell className="font-medium">{enrollment.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-primary">{enrollment.studentName}</div>
                          <div className="text-xs text-muted-foreground">{enrollment.studentId}</div>
                        </TableCell>
                        <TableCell>{enrollment.instructorName}</TableCell>
                        <TableCell>{enrollment.semester}</TableCell>
                        <TableCell className="text-xs">{enrollment.schedule}</TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(enrollment.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Chưa có lớp học nào được mở cho môn này.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setCourseDetailOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Chi tiết Enrollment */}
      <Dialog open={enrollmentDetailOpen} onOpenChange={setEnrollmentDetailOpen}>
        <DialogContent className="max-w-[800px] sm:max-w-[800px] max-h-[700px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold text-xl flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Chi tiết lớp học
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về enrollment {selectedEnrollment?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="grid gap-6 py-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-sm text-muted-foreground uppercase font-bold mb-1">Môn học</div>
                <div className="text-lg font-bold text-primary">{selectedEnrollment.courseName}</div>
                <div className="text-sm font-medium text-destructive mt-1">{selectedCourse?.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <User className="w-3 h-3" /> Sinh viên
                  </Label>
                  <div className="font-bold">{selectedEnrollment.studentName}</div>
                  <div className="text-xs text-muted-foreground">{selectedEnrollment.studentId}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <User className="w-3 h-3" /> Giảng viên
                  </Label>
                  <div className="font-bold">{selectedEnrollment.instructorName}</div>
                  <div className="text-xs text-muted-foreground">{selectedEnrollment.instructorId}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Học kỳ
                  </Label>
                  <div className="font-medium">{selectedEnrollment.semester}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Lịch học
                  </Label>
                  <div className="font-medium">{selectedEnrollment.schedule}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Điểm tổng kết</Label>
                  <div className="text-2xl font-bold text-destructive">
                    {selectedEnrollment.grade || '---'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Trạng thái</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedEnrollment.status)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollmentDetailOpen(false)}>Quay lại danh sách</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}