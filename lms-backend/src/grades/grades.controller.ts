import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GradeService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  create(@Body() dto: CreateGradeDto) {
    return this.gradeService.create(dto);
  }

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(id);
  }
  
  @Get('student/:id')
  findByStudent(@Param('id') id: string) {
    return this.gradeService.findByStudent(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGradeDto) {
    return this.gradeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeService.remove(id);
  }
}
