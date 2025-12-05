import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationStatus {
  Seen = 'Seen',
  Unseen = 'Unseen',
}

export class CreateNotificationDto {
  @ApiProperty({ example: 'NT000001' })
  @IsString()
  NotifID: string;

  @ApiProperty({ example: 'GRADE_UPDATE' })
  @IsString()
  Type: string;

  @ApiProperty({ example: 'Your grade has been updated.' })
  @IsString()
  Content: string;

  @ApiProperty({ example: 'ST000001' })
  @IsString()
  UserID: string;

  @ApiProperty({ example: 'Unseen', required: false })
  @IsOptional()
  @IsEnum(NotificationStatus)
  Status?: NotificationStatus;
}
