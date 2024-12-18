import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { FirebaseJwtStrategy } from './strategies/firebase-jwt.strategy';

@Module({
  imports: [
    UsersModule, // User 관련 서비스와 리포지토리 사용
    TypeOrmModule.forFeature([Users]), // User 엔티티 등록
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseJwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
