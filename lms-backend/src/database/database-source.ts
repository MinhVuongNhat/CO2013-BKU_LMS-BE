import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'sManager',
  password: '123456',
  database: 'lms',
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
});