import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './courses/courses.module';
import { GradeModule } from './grades/grades.module';
import { StudentModule } from './students/students.module';
import { UserModule } from './user/user.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { NotificationModule } from './notifications/notifications.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CourseModule,
    GradeModule,
    StudentModule,
    UserModule,
    EnrollmentModule,
    NotificationModule,
    StatisticsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
