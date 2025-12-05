import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Create normal
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  // Create using stored procedure
  @Post('procedure')
  createUsingProcedure(@Body() dto: CreateStudentDto) {
    return this.studentService.createUsingProcedure(dto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get('department/:deptId')
  getByDept(@Param('deptId') deptId: string) {
    return this.studentService.getByDepartment(deptId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
