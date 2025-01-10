import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habits } from './entities/habits.entity';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/users.entity';
import { HabitAttendance } from './entities/habit-attendance.entity';
import { HabitsBatchService } from './habits-batch.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habits, HabitAttendance]),
    UsersModule, // User 관련 서비스와 리포지토리 사용
    TypeOrmModule.forFeature([Users]), // User 엔티티 등록
  ],
  providers: [HabitsService, HabitsBatchService],
  controllers: [HabitsController]
})
export class HabitsModule { }
