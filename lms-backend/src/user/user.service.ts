import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('MYSQL_POOL')
    private readonly pool: Pool,
  ) {}

  async findAll() {
    const [rows] = await this.pool.query('SELECT * FROM User');
    return rows;
  }

  async findOne(id: string) {
    const [rows]: any = await this.pool.query('SELECT * FROM User WHERE UserID = ?', [id]);
    if (rows.length === 0) throw new NotFoundException('User not found');
    return rows[0];
  }

  async create(data: CreateUserDto) {
    const sql = `
      INSERT INTO User (UserID, LastName, FirstName, Email, Phone, Address, Age, DoB)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.UserID,
      data.LastName,
      data.FirstName,
      data.Email,
      data.Phone || null,
      data.Address || null,
      data.Age || null,
      data.DoB || null,
    ];

    await this.pool.query(sql, params);
    return { message: 'User created successfully' };
  }

  async update(id: string, data: UpdateUserDto) {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, val]) => {
      fields.push(`${key} = ?`);
      values.push(val);
    });

    if (fields.length === 0) return { message: 'No fields to update' };

    const sql = `UPDATE User SET ${fields.join(', ')} WHERE UserID = ?`;
    values.push(id);

    const [result]: any = await this.pool.query(sql, values);

    if (result.affectedRows === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User updated successfully' };
  }

  async remove(id: string) {
    const [result]: any = await this.pool.query('DELETE FROM User WHERE UserID = ?', [id]);
    if (result.affectedRows === 0) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
