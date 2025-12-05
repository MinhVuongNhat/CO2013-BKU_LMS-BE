import { Module } from '@nestjs/common';
import { GradeService } from './grades.service';
import { GradeController } from './grades.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
