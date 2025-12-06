import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.notificationService.findAll(userId);
  }

  @Get(':id')
  findOne(@Query('NotifId') NotifId: string) {
    return this.notificationService.findOne(NotifId);
  }

  @Get('unread-count')
  getUnread(@Query('userId') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Patch(':id/seen')
  markSeen(@Param('id') id: string) {
    return this.notificationService.markSeen(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
