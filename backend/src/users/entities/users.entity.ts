import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // 데이터베이스 테이블 이름
export class Users {
  @PrimaryGeneratedColumn()
  id: number; // 기본 키

  @Column({ unique: true })
  email: string; // 사용자 이메일 (고유)

  @Column()
  password: string; // 비밀번호 (해시화 저장)

  @Column()
  username: string; // 사용자 이름

  @Column({ nullable: true })
  walletAddress: string; // 지갑 주소 (연결 시 추가)

  @CreateDateColumn()
  createdAt: Date; // 생성 일자

  @UpdateDateColumn()
  updatedAt: Date; // 수정 일자
}
