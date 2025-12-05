import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  // --------------------------
  // Create using stored procedure
  // --------------------------
  async createUsingProcedure(dto: CreateStudentDto) {
    const sql = `CALL AddNewStudent(?, ?, ?, ?)`;

    await this.pool.execute(sql, [
      dto.StudentID,
      dto.EnrollmentYear,
      dto.Major ?? null,
      dto.DeptID,
    ]);

    return { message: 'Student created via stored procedure' };
  }

  // --------------------------
  // Basic CRUD
  // --------------------------
  async create(dto: CreateStudentDto) {
    const sql = `
      INSERT INTO Student (StudentID, EnrollmentYear, Major, DeptID)
      VALUES (?, ?, ?, ?)
    `;

    await this.pool.execute(sql, [
      dto.StudentID,
      dto.EnrollmentYear,
      dto.Major ?? null,
      dto.DeptID,
    ]);

    return { message: 'Student created successfully' };
  }

  async findAll() {
    const [rows] = await this.pool.execute(`SELECT * FROM Student`);
    return rows;
  }

  async findOne(id: string) {
    const [rows] = await this.pool.execute(
      `SELECT * FROM Student WHERE StudentID = ?`,
      [id],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new NotFoundException(`Student ${id} not found`);
    }

    return rows[0];
  }

  async update(id: string, dto: UpdateStudentDto) {
    const current = await this.findOne(id);

    const updated = { ...current, ...dto };

    const sql = `
      UPDATE Student
      SET EnrollmentYear = ?, Major = ?, DeptID = ?
      WHERE StudentID = ?
    `;

    await this.pool.execute(sql, [
      updated.EnrollmentYear,
      updated.Major,
      updated.DeptID,
      id,
    ]);

    return { message: `Student ${id} updated successfully` };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.pool.execute(`DELETE FROM Student WHERE StudentID = ?`, [id]);

    return { message: `Student ${id} deleted successfully` };
  }

  // --------------------------
  // Get students by department (stored procedure)
  // --------------------------
  async getByDepartment(deptId: string) {
    const sql = `CALL GetStudentsByDepartment(?)`;

    const [resultSets] = await this.pool.execute(sql, [deptId]);
    return resultSets[0]; // MySQL returns nested arrays for procedures
  }
}
