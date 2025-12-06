import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  async getTotalUsers() {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM UserAccount`,
    );
    return rows[0];
  }

  async getTotalClasses() {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM Enrollment`,
    );
    return rows[0];
  }

  async getTotalCourses() {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM Course`,
    );
    return rows[0];
  }

  async getTotalAssignments() {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM Assessment`,
    );
    return rows[0];
  }

  async getOverview() {
    const [users] = await this.pool.query(
      `SELECT COUNT(*) AS totalUsers FROM UserAccount`,
    );

    const [classes] = await this.pool.query(
      `SELECT COUNT(*) AS totalClasses FROM Enrollment`,
    );

    const [courses] = await this.pool.query(
      `SELECT COUNT(*) AS totalCourses FROM Course`,
    );

    const [assignments] = await this.pool.query(
      `SELECT COUNT(*) AS totalAssignments FROM Assessment`,
    );

    return {
      totalUsers: users[0].totalUsers,
      totalClasses: classes[0].totalClasses,
      totalCourses: courses[0].totalCourses,
      totalAssignments: assignments[0].totalAssignments,
    };
  }
}
