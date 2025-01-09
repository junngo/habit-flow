import { Body, Controller, Post, Request, UseGuards, Get, Query, Patch, Param } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';

@Controller('habits')
@UseGuards(FirebaseAuthGuard) // 인증 필요
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) { }

  @Post()
  async createHabit(@Body() createHabitDto: CreateHabitDto, @Request() req: any) {
    const userEmail = req.user.email;
    return await this.habitsService.createHabit(createHabitDto, userEmail);
  }

  // 습관 리스트 조회
  @Get()
  async getHabits(
    @Request() req: any,
    @Query('frequency') frequency?: string,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userEmail = req.user.email;
    const query = { frequency, status, page, limit }
    return await this.habitsService.getHabits(query, userEmail);
  }

  // 출석 데이터 업데이트
  @Patch(':habitId/attendance')
  async updateAttendance(
    @Param('habitId') habitId: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Request() req: any,
  ) {
    const userEmail = req.user.email;
    return await this.habitsService.updateAttendance(habitId, updateAttendanceDto, userEmail);
  }

  // 하나의 습관에 대한 상세(출석 데이터 조회)
  @Get(':habitId')
  async getHabit(
    @Request() req: any,
    @Param('habitId') habitId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userEmail = req.user.email;
    return await this.habitsService.getAttendanceRecords(habitId, userEmail, startDate, endDate);
  }
}
