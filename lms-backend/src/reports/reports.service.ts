import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  /** 1. Gọi FUNCTION: tính GPA + xếp loại */
  async getStudentGPA(studentId: string, semester: string) {
    const [rows] = await this.pool.query(
      `
        SELECT 
          GetStudentGPA(?, ?) AS GPA,
          GetAcademicRanking(GetStudentGPA(?, ?)) AS Ranking
      `,
      [studentId, semester, studentId, semester],
    );

    return rows[0];
  }

  /** 2. Gọi FUNCTION: lấy tổng tín chỉ hoàn thành */
  async getCompletedCredits(studentId: string) {
    const [rows] = await this.pool.query(
      `SELECT GetCompletedCredits(?) AS CompletedCredits`,
      [studentId],
    );
    return rows[0];
  }

  /** 3. Gọi PROCEDURE: danh sách sinh viên theo khoa */
  async getStudentsByDepartment(deptId: string, semester: string) {
    const [rows] = await this.pool.query(
      `CALL GetStudentsByDepartment(?, ?)`,
      [deptId, semester],
    );

    return rows[0]; 
  }

  /** 4. Gọi PROCEDURE: thống kê theo giảng viên */
  async getInstructorStats(instructorId: string) {
    const [rows] = await this.pool.query(
      `CALL GetInstructorCourseStats(?)`,
      [instructorId],
    );
    return rows[0];
  }

  /** 5. Gọi PROCEDURE: danh sách cảnh cáo học vụ */
  async getWarningStudents(semester: string) {
    const [rows] = await this.pool.query(
      `CALL GetWarningStudents(?)`,
      [semester],
    );
    return rows[0];
  }

  /** 6. Gọi PROCEDURE: gửi thông báo deadline */
  async sendDeadlineReminder() {
    await this.pool.query(`CALL SendDeadlineReminders()`);
    return { message: 'Deadline reminders sent.' };
  }
}
