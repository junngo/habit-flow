import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habits } from './entities/habits.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habits)
    private readonly habitsRepository: Repository<Habits>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  async createHabit(createHabitDto: CreateHabitDto, email: string): Promise<Habits> {
    const { startDate, endDate } = createHabitDto;

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
      usersId: user.id,
    });

    return await this.habitsRepository.save(habit);
  }
}
