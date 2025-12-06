import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('stats')
export class StatisticsController {
  constructor(private readonly statsService: StatisticsService) {}

  @Get('total-users')
  getTotalUsers() {
    return this.statsService.getTotalUsers();
  }

  @Get('total-classes')
  getTotalClasses() {
    return this.statsService.getTotalClasses();
  }

  @Get('total-courses')
  getTotalCourses() {
    return this.statsService.getTotalCourses();
  }

  @Get('total-assignments')
  getTotalAssignments() {
    return this.statsService.getTotalAssignments();
  }

  @Get('overview')
  getOverview() {
    return this.statsService.getOverview();
  }
}
