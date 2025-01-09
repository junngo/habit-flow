import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('habit_attendance')
export class HabitAttendance {
  @PrimaryGeneratedColumn()
  id: number; // 출석 ID

  @Column()
  habitId: number; // 습관 ID (논리적 외래키)

  @Column()
  userId: number; // 유저 ID (논리적 외래키)

  @Column({ type: 'date' })
  date: string; // 해당 날짜 (YYYY-MM-DD 형식)

  @Column({ type: 'enum', enum: ['INITIAL', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'SKIPPED'], default: 'INITIAL' })
  status: 'INITIAL' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

  @Column({ type: 'time', nullable: true })
  startTime: string | null; // 시작 시간 (타이머 기반 습관에서 사용)

  @Column({ type: 'time', nullable: true })
  endTime: string | null; // 종료 시간 (타이머 기반 습관에서 사용)

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean; // 삭제 여부

  @CreateDateColumn()
  createdAt: Date; // 생성 시간

  @UpdateDateColumn()
  updatedAt: Date; // 수정 시간
}
