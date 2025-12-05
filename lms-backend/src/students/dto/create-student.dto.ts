import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'ST000001' })
  @IsString()
  StudentID: string;

  @ApiProperty({ example: 2022 })
  @IsNumber()
  @Min(1900)
  @Max(2100)
  EnrollmentYear: number;

  @ApiProperty({ example: 'Computer Science' })
  @IsOptional()
  @IsString()
  Major?: string;

  @ApiProperty({ example: 'D001' })
  @IsString()
  DeptID: string;
}
