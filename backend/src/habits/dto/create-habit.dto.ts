import { IsNotEmpty, IsDateString, IsOptional, IsIn } from 'class-validator';

export class CreateHabitDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsIn(['daily', 'weekly', 'monthly'], { message: 'Frequency must be daily, weekly, or monthly' })
  frequency: string;
}
