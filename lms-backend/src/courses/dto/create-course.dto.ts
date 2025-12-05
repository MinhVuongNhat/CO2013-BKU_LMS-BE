import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'CSE10101' })
  @IsString()
  CourseID: string;

  @ApiProperty({ example: 'Introduction to Programming' })
  @IsString()
  Name: string;

  @ApiProperty({ example: 'Basic programming concepts' })
  @IsOptional()
  @IsString()
  Description?: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  @Max(10)
  Credit: number;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(1)
  Duration: number;

  @ApiProperty({ example: 'CSE001' })
  @IsOptional()
  @IsString()
  DeptID?: string;

  @ApiProperty({ example: 'TEA00001' })
  @IsOptional()
  @IsString()
  InstructorID?: string;
}
