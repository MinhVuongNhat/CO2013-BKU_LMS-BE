import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  async create(dto: CreateNotificationDto) {
    const sql = `
      INSERT INTO Notification (NotifID, Type, Content, UserID, Status)
      VALUES (?, ?, ?, ?, ?)
    `;

    await this.pool.execute(sql, [
      dto.NotifID,
      dto.Type,
      dto.Content,
      dto.UserID,
      dto.Status ?? 'Unseen',
    ]);

    return { message: 'Notification created successfully' };
  }

  async findAll(userId: string) {
    const sql = `SELECT * FROM Notification`;

    const [rows] = await this.pool.execute(sql, [userId]);
    return rows;
  }

  async findOne(id: string) {
    const [rows] = await this.pool.execute(
      `SELECT * FROM Notification WHERE NotifID = ?`,
      [id],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    return rows[0];
  }

  async markSeen(id: string) {
    await this.findOne(id);

    await this.pool.execute(`UPDATE Notification SET Status = 'Seen' WHERE NotifID = ?`, [id]);

    return { message: `Notification ${id} marked as Seen` };
  }

  async getUnreadCount(userId: string) {
    const sql = `
      SELECT COUNT(*) AS unread
      FROM Notification
      WHERE UserID = ? AND Status = 'Unseen'
    `;

    const [rows] = await this.pool.execute(sql, [userId]);
    return rows[0];
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.pool.execute(`DELETE FROM Notification WHERE NotifID = ?`, [id]);
    return { message: `Notification ${id} deleted` };
  }
}
