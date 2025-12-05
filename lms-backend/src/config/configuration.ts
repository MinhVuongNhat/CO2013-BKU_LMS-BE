// src/config/configuration.ts
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER ?? 'sManager',
    password: process.env.DB_PASS ?? '123456',
    database: process.env.DB_NAME ?? 'LMS',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'superSecretKey2025LMS',
    expiresIn: '24h',
  },
}));