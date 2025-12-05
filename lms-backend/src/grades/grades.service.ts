import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradeService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  async create(dto: CreateGradeDto) {
    const sql = `
      INSERT INTO Grade (GradeID, StudentID, AssessID, Score, GradeLetter, DateRecorded)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const dateRecorded = dto.DateRecorded ?? new Date().toISOString().slice(0, 10);

    await this.pool.execute(sql, [
      dto.GradeID,
      dto.StudentID,
      dto.AssessID,
      dto.Score,
      dto.GradeLetter,
      dateRecorded,
    ]);

    return { message: 'Grade created successfully' };
  }

  async findAll() {
    const [rows] = await this.pool.execute(`SELECT * FROM Grade`);
    return rows;
  }

  async findOne(id: string) {
    const [rows] = await this.pool.execute(`SELECT * FROM Grade WHERE GradeID = ?`, [id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new NotFoundException(`Grade ${id} not found`);
    }
    return rows[0];
  }
  
  async findByStudent(studentId: string) {
    const [rows] = await this.pool.execute(
      `SELECT * FROM Grade WHERE StudentID = ?`,
      [studentId],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new NotFoundException(`No grades found for student ${studentId}`);
    }

    return rows;
  }

  async update(id: string, dto: UpdateGradeDto) {
    const current = await this.findOne(id);

    const updated = { ...current, ...dto };

    const sql = `
      UPDATE Grade
      SET StudentID = ?, AssessID = ?, Score = ?, GradeLetter = ?, DateRecorded = ?
      WHERE GradeID = ?
    `;

    await this.pool.execute(sql, [
      updated.StudentID,
      updated.AssessID,
      updated.Score,
      updated.GradeLetter,
      updated.DateRecorded,
      id,
    ]);

    return { message: `Grade ${id} updated successfully` };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.pool.execute(`DELETE FROM Grade WHERE GradeID = ?`, [id]);

    return { message: `Grade ${id} deleted successfully` };
  }
}
