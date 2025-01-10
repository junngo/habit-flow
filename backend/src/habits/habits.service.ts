import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual, Between } from 'typeorm';
import { Habits } from './entities/habits.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Users } from 'src/users/entities/users.entity';
import { HabitAttendance } from './entities/habit-attendance.entity';
import { addDays, eachDayOfInterval, format } from 'date-fns';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habits)
    private readonly habitsRepository: Repository<Habits>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(HabitAttendance)
    private readonly habitAttendanceRepository: Repository<HabitAttendance>,
  ) { }

  async createHabit(createHabitDto: CreateHabitDto, email: string): Promise<Habits> {
    const { startDate, endDate, frequency } = createHabitDto;

    // 이메일로 유저 조회
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 날짜 유효성 검사
    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('Start date must be earlier than end date');
    }

    // 습관 생성
    const habit = this.habitsRepository.create({
      ...createHabitDto,
      userId: user.id,
    });
    const savedHabit = await this.habitsRepository.save(habit);

    // 출석 데이터 생성
    await this.generateAttendanceData(savedHabit.id, user.id, startDate, endDate, frequency);

    return savedHabit;
  }

  private async generateAttendanceData(
    habitId: number,
    userId: number,
    startDate: string,
    endDate: string,
    frequency: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const attendanceDates =
      frequency === 'daily'
        ? eachDayOfInterval({ start, end }) // 매일 생성
        : Array.from({ length: Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) }).map(
          (_, i) => addDays(start, i * 7),
        ); // 매주 생성

    // HabitAttendance 엔티티에 데이터 저장
    const attendanceRecords = attendanceDates.map((date) => ({
      habitId,
      userId,
      date: format(date, 'yyyy-MM-dd'),
      status: 'INITIAL' as 'INITIAL', // 초기 상태
    }));

    await this.habitAttendanceRepository.save(attendanceRecords);
  }

  async getHabits(query: any, email: string) {
    const { frequency, status, page, limit } = query;

    // 이메일로 유저 조회
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 기본 페이징 설정
    const take = limit > 0 ? limit : 10;
    const skip = (page - 1) * take;

    // 기본 조건
    const where: any = { userId: user.id, isDeleted: false };

    // 필터링 조건 추가
    if (frequency) {
      where.frequency = frequency;
    }
    if (status === 'active') {
      where.endDate = MoreThanOrEqual(new Date()); // 현재 날짜 이후
    } else if (status === 'finished') {
      where.endDate = LessThan(new Date()); // 현재 날짜 이전
    }

    // 데이터 조회 및 총 개수 반환
    const [habits, total] = await this.habitsRepository.findAndCount({
      where,
      skip,                         // 건너뛸 개수
      take,                         // 가져올 개수
      order: { startDate: 'ASC' },  // 기본 정렬
    });

    return {
      data: habits,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async updateAttendance(habitId: number, updateAttendanceDto: UpdateAttendanceDto, userEmail: string) {
    // 이메일로 유저 조회
    console.log("updateAttendanceDto: ", updateAttendanceDto);
    const user = await this.usersRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    console.log("user: ", user);

    // 출석 정보 조회
    const attendance = await this.habitAttendanceRepository.findOne({
      where: { habitId, userId: user.id, date: updateAttendanceDto.date },
    });
    if (!attendance) {
      throw new NotFoundException('Attendance record not found for the given date');
    }

    // 습관 정보 조회
    const habit = await this.habitsRepository.findOne({ where: { id: habitId } })
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    switch (updateAttendanceDto.action) {
      case 'COMPLETE':
        if (habit.type === 'TIMER') {
          if (attendance.status !== 'IN_PROGRESS') {
            throw new BadRequestException('Cannot COMPLETE timer unless status is IN_PROGRESS');
          }
          if (!attendance.startTime) {
            throw new BadRequestException('Cannot COMPLETE timer habit without a start time');
          }
          attendance.endTime = new Date().toISOString().split('T')[1].slice(0, 8);
        } else if (habit.type === 'SIMPLE') {
          if (attendance.status !== 'INITIAL') {
            throw new BadRequestException('Cannot COMPLETE simple habit unless status is INITIAL');
          }
        }
        attendance.status = 'SUCCESS';
        break;
      case 'START':
        if (habit.type !== 'TIMER') {
          throw new BadRequestException('START action is only allowed for TIMER type habits');
        }
        if (attendance.status === 'IN_PROGRESS') {
          throw new BadRequestException('Timer is already in progress');
        }
        if (attendance.status !== 'INITIAL') {
          throw new BadRequestException('Cannot START timer unless status is INITIAL');
        }
        attendance.startTime = new Date().toISOString().split('T')[1].slice(0, 8);
        attendance.status = 'IN_PROGRESS';
        break;
      case 'SKIP':
        if (attendance.status !== 'INITIAL') {
          throw new BadRequestException('Cannot SKIP unless status is INITIAL');
        }
        attendance.status = 'SKIPPED';
        break;
      default:
        throw new BadRequestException('Invalid action');
    }

    return this.habitAttendanceRepository.save(attendance);
  }

  async getAttendanceRecords(
    habitId: number,
    userEmail: string,
    startDate: string,
    endDate: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const habit = await this.habitsRepository.findOne({ where: { id: habitId, userId: user.id } });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const whereCondition: any = { habitId, userId: habit.userId };

    if (startDate && endDate) {
      whereCondition.date = Between(startDate, endDate); // 기간 필터링
    }

    const attendanceRecords = await this.habitAttendanceRepository.find({
      where: whereCondition,
      order: { date: 'ASC' },
    });

    return {
      habitId: habit.id,
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      type: habit.type,
      attendanceRecords,
    };
  }
}
