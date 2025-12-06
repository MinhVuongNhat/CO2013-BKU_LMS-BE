import { IsString, Length, IsEmail, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(8, 8)
  UserID: string;

  @IsString()
  LastName: string;

  @IsString()
  FirstName: string;

  @IsEmail()
  Email: string;

  @IsString()
  @IsOptional()
  Phone?: string;

  @IsString()
  @IsOptional()
  Address?: string;

  @IsInt()
  @Min(16)
  @Max(100)
  @IsOptional()
  Age?: number;

  @IsDateString()
  @IsOptional()
  DoB?: string;
}
