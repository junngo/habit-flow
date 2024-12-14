import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule, // User 관련 서비스와 리포지토리 사용
    TypeOrmModule.forFeature([User]), // User 엔티티 등록
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
