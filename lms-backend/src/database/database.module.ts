import { Module, Logger } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

@Module({
  providers: [
    {
      provide: 'MYSQL_POOL',
      useFactory: async () => {
        const logger = new Logger('DatabaseModule');

        const pool = createPool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          waitForConnections: true,
          connectionLimit: 10,
        });

        try {
          await pool.query('SELECT 1');
          logger.log('MySQL connected successfully');
        } catch (err) {
          logger.error('MySQL connection failed', err);
          throw err;
        }

        return pool;
      },
    },
  ],
  exports: ['MYSQL_POOL'],
})
export class DatabaseModule {}
