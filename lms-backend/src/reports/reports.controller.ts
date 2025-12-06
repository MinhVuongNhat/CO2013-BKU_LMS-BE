import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /** 1. GPA + Ranking */
  @Get('gpa/:studentId/:semester')
  getGPA(
    @Param('studentId') studentId: string,
    @Param('semester') semester: string,
  ) {
    return this.reportsService.getStudentGPA(studentId, semester);
  }

  /** 2. Tín chỉ hoàn thành */
  @Get('credits/:studentId')
  getCredits(@Param('studentId') studentId: string) {
    return this.reportsService.getCompletedCredits(studentId);
  }

  /** 3. DS sinh viên theo khoa */
  @Get('department/:deptId/:semester')
  getStudentsByDepartment(
    @Param('deptId') deptId: string,
    @Param('semester') semester: string,
  ) {
    return this.reportsService.getStudentsByDepartment(deptId, semester);
  }

  /** 4. Thống kê lớp theo giảng viên */
  @Get('instructor/:instructorId')
  getInstructorStats(@Param('instructorId') instructorId: string) {
    return this.reportsService.getInstructorStats(instructorId);
  }

  /** 5. Sinh viên bị cảnh cáo */
  @Get('warnings/:semester')
  getWarningStudents(@Param('semester') semester: string) {
    return this.reportsService.getWarningStudents(semester);
  }

  /** 6. Gửi thông báo gần deadline */
  @Get('notifications/deadlines/send')
  sendDeadline() {
    return this.reportsService.sendDeadlineReminder();
  }
}
