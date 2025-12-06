import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly validUsers = [
    { id: 'USR000', email: 'sManager@hcmut.edu.vn', password: '123456', role: 'Admin' }, // sManager
    // Thêm tài khoản cho demo
  ];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.validUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}