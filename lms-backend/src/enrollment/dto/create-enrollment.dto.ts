import { IsNotEmpty, IsOptional, IsEnum, IsString, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @IsString()
  @Length(8, 8)
  EnrollID: string;

  @IsString()
  @Length(8, 8)
  StudentID: string;

  @IsString()
  @Length(8, 8)
  CourseID: string;

  @IsEnum(['Enrolled', 'Completed', 'Dropped'])
  @IsOptional()
  Status: 'Enrolled' | 'Completed' | 'Dropped';

  @IsString()
  @IsNotEmpty()
  Semester: string;

  @IsNumber()
  @IsOptional()
  GradeFinal?: number;

  @IsString()
  @IsOptional()
  Schedule?: string;

  @ApiProperty({ example: 'TEA00001' })
  @IsOptional()
  @IsString()
  InstructorID?: string;
}
