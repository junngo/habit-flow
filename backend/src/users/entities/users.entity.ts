import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // users 테이블
export class Users {
  @PrimaryGeneratedColumn()
  id: number;                 // 기본 키

  @Column({ unique: true })
  email: string;              // 사용자 이메일 (고유)

  @Column()
  external_uid: string;       // 외부 ID(UID) (구글)

  @Column()
  username: string;           // 사용자 이름

  @Column({ nullable: true })
  walletAddress: string;      // 지갑 주소 (연결 시 추가)

  @Column({ default: 'Asia/Seoul' }) // 기본값 한국 시간대
  timezone: string;           // 타임존

  @Column({ type: 'timestamp', nullable: true })
  timezoneUpdatePendingAt: Date | null; // 타임존 변경 대기 시간 (null이면 대기 없음)

  @CreateDateColumn()
  createdAt: Date;            // 생성 일자

  @UpdateDateColumn()
  updatedAt: Date;            // 수정 일자
}
