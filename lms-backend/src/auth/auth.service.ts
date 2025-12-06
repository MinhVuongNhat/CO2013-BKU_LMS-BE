import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MYSQL_POOL') private pool: Pool,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const sql = `
      SELECT AccountID, UserID, Email, PasswordHash, Role
      FROM UserAccount
      WHERE Email = ?
      LIMIT 1
    `;

    const [rows]: any = await this.pool.execute(sql, [dto.email]);

    if (!rows || rows.length === 0) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    const user = rows[0];
    if (user.PasswordHash !== dto.password) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    const payload = {
      sub: user.AccountID,
      userId: user.UserID,
      role: user.Role,
      email: user.Email,
    };

    const token = await this.jwt.signAsync(payload);

    return {
      message: 'Login success',
      access_token: token,
      user: {
        accountId: user.AccountID,
        userId: user.UserID,
        email: user.Email,
        role: user.Role,
      },
    };
  }
}
