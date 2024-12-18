import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('habits')
export class Habits {
  @PrimaryGeneratedColumn()
  id: number;                 // 습관 ID

  @Column()
  title: string;              // 습관 제목

  @Column({ nullable: true })
  description: string;        // 습관 설명

  @Column({ type: 'timestamp' })
  startDate: Date;            // 시작 날짜

  @Column({ type: 'timestamp' })
  endDate: Date;              // 종료 날짜

  @Column({ default: 'daily' })
  frequency: string;          // 반복 주기 (daily, weekly 등)

  @Column()
  usersId: number;            // 유저 ID (논리적 외래키)

  @Column({ default: false })
  isDeleted: boolean;         // 삭제 여부 (논리적 삭제)

  @CreateDateColumn()
  createdAt: Date;            // 생성일

  @UpdateDateColumn()
  updatedAt: Date;            // 수정일
}
