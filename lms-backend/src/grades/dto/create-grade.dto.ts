import { IsString, IsNumber, IsOptional, IsDateString, Max, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GradeLetterEnum {
  A_PLUS = 'A+',
  A = 'A',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B = 'B',
  B_MINUS = 'B-',
  C_PLUS = 'C+',
  C = 'C',
  C_MINUS = 'C-',
  D_PLUS = 'D+',
  D = 'D',
  D_MINUS = 'D-',
  F = 'F',
}

export class CreateGradeDto {
  @ApiProperty({ example: 'GR000001' })
  @IsString()
  GradeID: string;

  @ApiProperty({ example: 'ST000001' })
  @IsString()
  StudentID: string;

  @ApiProperty({ example: 'AS000001' })
  @IsString()
  AssessID: string;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  Score: number;

  @ApiProperty({ example: 'A+' })
  @IsEnum(GradeLetterEnum)
  GradeLetter: GradeLetterEnum;

  @ApiProperty({ example: '2024-12-01' })
  @IsOptional()
  @IsDateString()
  DateRecorded?: string;
}
