import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { HabitAttendance } from './entities/habit-attendance.entity';
import { Users } from '../users/entities/users.entity';
import { Habits } from './entities/habits.entity';
import { DateTime } from 'luxon'

@Injectable()
export class HabitsBatchService {
  private readonly logger = new Logger(HabitsBatchService.name);

  constructor(
    @InjectRepository(HabitAttendance)
    private readonly habitAttendanceRepository: Repository<HabitAttendance>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Habits)
    private readonly habitsRepository: Repository<Habits>,
  ) { }

  // @Cron('0 * * * *') // 매시 정각마다 실행
  @Cron('0 */10 * * * *') // 10분마다 실행
  async handleFailedAttendanceCheck() {
    this.logger.log('🔥 Running attendance failure batch job...');

    const now = new Date();

    // PENDING 또는 IN_PROGRESS 상태의 습관 조회
    const habits = await this.habitsRepository.find({
      where: {
        status: In(['PENDING', 'IN_PROGRESS']),
        endDate: LessThan(now),
      },
    });

    for (const habit of habits) {
      const user = await this.usersRepository.findOne({ where: { id: habit.userId } });
      if (!user) {
        this.logger.warn(`🚫 User not found for habit ID ${habit.id}`);
        continue;
      }

      const timezone = user.timezone || 'UTC'; // 기본값 UTC
      // luxon을 사용해 timezone에 맞는 현재 시간 계산
      const userCurrentTime = DateTime.now().setZone(timezone);
      // 자정 계산
      const midnightToday = userCurrentTime.startOf('day');

      const failedAttendances = await this.habitAttendanceRepository.find({
        where: {
          habitId: habit.id,
          status: 'INITIAL',
          date: LessThan(midnightToday.toISODate()), // 날짜 비교 (YYYY-MM-DD 형식)
        },
      });

      if (failedAttendances.length > 0) {
        failedAttendances.forEach((attendance) => {
          attendance.status = 'FAILED';
        });

        await this.habitAttendanceRepository.save(failedAttendances);
        this.logger.log(`✅ Updated ${failedAttendances.length} attendances to FAILED for habit ${habit.id}`);
      }

      // 습관의 출석률 계산
      const totalAttendances = await this.habitAttendanceRepository.count({ where: { habitId: habit.id } });
      const successfulAttendances = await this.habitAttendanceRepository.count({
        where: { habitId: habit.id, status: 'SUCCESS' },
      });

      const attendanceRate = (successfulAttendances / totalAttendances) * 100;

      // 출석률에 따른 습관 상태 변경
      if (attendanceRate >= 80) {
        habit.status = 'COMPLETED';
        this.logger.log(`🎉 Habit ${habit.id} marked as COMPLETED`);
      } else {
        habit.status = 'FAILED';
        this.logger.log(`❌ Habit ${habit.id} marked as FAILED`);
      }

      await this.habitsRepository.save(habit);
    }
  }
}
