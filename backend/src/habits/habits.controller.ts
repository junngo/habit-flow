import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
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
}
