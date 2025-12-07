import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  async findAll(query: any) {
    const {
      search = '',
      sort = 'EnrollID',
      order = 'ASC',
      page = 1,
      limit = 200,
    } = query;

    const offset = (page - 1) * limit;

    const [rows] = await this.pool.query(
      `
      SELECT 
        e.*,
        CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
        c.Name AS CourseName,
        CONCAT(ins.FirstName, ' ', ins.LastName) AS InstructorName
      FROM Enrollment e
      LEFT JOIN User s ON e.StudentID = s.UserID
      LEFT JOIN Course c ON e.CourseID = c.CourseID
      LEFT JOIN User ins ON e.InstructorID = ins.UserID
      WHERE 
        e.EnrollID LIKE ? 
        OR e.StudentID LIKE ?
        OR e.CourseID LIKE ?
        OR s.FirstName LIKE ?
        OR s.LastName LIKE ?
        OR c.Name LIKE ?
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
      `,
      [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        Number(limit),
        Number(offset),
      ],
    );

    return rows;
  }

  async findOne(id: string) {
    const [rows] = await this.pool.query(
      `
      SELECT 
        e.*,
        CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
        c.Name AS CourseName,
        CONCAT(ins.FirstName, ' ', ins.LastName) AS InstructorName
      FROM Enrollment e
      LEFT JOIN User s ON e.StudentID = s.UserID
      LEFT JOIN Course c ON e.CourseID = c.CourseID
      LEFT JOIN User ins ON e.InstructorID = ins.UserID
      WHERE e.EnrollID = ?
      `,
      [id],
    );

    if (!rows || (rows as any[]).length === 0) {
      throw new NotFoundException('Enrollment not found');
    }

    return rows[0];
  }

  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    await this.pool.query(
      `
      INSERT INTO Enrollment 
        (EnrollID, StudentID, CourseID, Status, Semester, GradeFinal, Schedule, InstructorID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        dto.EnrollID,
        dto.StudentID,
        dto.CourseID,
        dto.Status || 'Enrolled',
        dto.Semester,
        dto.GradeFinal ?? null,
        dto.Schedule ?? null,
        dto.InstructorID,
      ],
    );

    return dto;
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    await this.findOne(id);

    await this.pool.query(
      `
      UPDATE Enrollment
      SET StudentID = ?, CourseID = ?, Status = ?, Semester = ?, GradeFinal = ?, Schedule = ?
      WHERE EnrollID = ?
      `,
      [
        dto.StudentID,
        dto.CourseID,
        dto.Status,
        dto.Semester,
        dto.GradeFinal,
        dto.Schedule,
        id,
      ],
    );

    return { message: 'Enrollment updated successfully' };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.pool.query(`DELETE FROM Enrollment WHERE EnrollID = ?`, [id]);
    return { message: 'Enrollment deleted successfully' };
  }
}
