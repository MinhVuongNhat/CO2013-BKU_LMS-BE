import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';


@Injectable()
export class CourseService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  async findAll(query: any) {
    const {
      search = '',
      sort = 'Name',
      order = 'ASC',
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;

    const [rows] = await this.pool.query(
      `
      SELECT *
      FROM Course
      WHERE Name LIKE ?
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
      `,
      [`%${search}%`, Number(limit), Number(offset)],
    );

    return rows;
  }

  async findOne(id: string) {
    const [rows] = await this.pool.query(
      `
      SELECT 
        c.*,
        (
          SELECT COUNT(*)
          FROM Enrollment e
          WHERE e.CourseID = c.CourseID
        ) AS StudentCount
      FROM Course c
      WHERE c.CourseID = ?
      `,
      [id],
    );

    if (!rows || (rows as any[]).length === 0) {
      throw new NotFoundException('Course not found');
    }

    return rows[0];
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    await this.pool.query(
      `
      INSERT INTO Course (CourseID, Name, Description, Credit, Duration, DeptID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        dto.CourseID,
        dto.Name,
        dto.Description || null,
        dto.Credit,
        dto.Duration,
        dto.DeptID || null,
      ],
    );

    return dto;
  }

  async update(id: string, dto: UpdateCourseDto) {
    const [result] = await this.pool.query(
      `
      UPDATE Course
      SET Name = ?, Description = ?, Credit = ?, Duration = ?, DeptID = ?
      WHERE CourseID = ?
      `,
      [
        dto.Name,
        dto.Description,
        dto.Credit,
        dto.Duration,
        dto.DeptID,
        id,
      ],
    );

    return { message: 'Course updated successfully' };
  }

  async remove(id: string) {
    try {
      await this.pool.query(`DELETE FROM Course WHERE CourseID = ?`, [id]);
      return { message: 'Course deleted successfully' };
    } catch (err) {
      return {
        message:
          'Cannot delete course — maybe it has enrollments (trigger prevented)',
        error: err.sqlMessage,
      };
    }
  }
}
