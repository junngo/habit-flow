import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Users } from './users/entities/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initializeFirebase } from './auth/firebase-admin';
import { HabitsModule } from './habits/habits.module';
import { Habits } from './habits/entities/habits.entity';
import { HabitAttendance } from './habits/entities/habit-attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'habitflow_user',
      password: 'habitflow_password',
      database: 'habitflow_db',
      entities: [Users, Habits, HabitAttendance],
      synchronize: true, // 개발 환경에서만 사용. 운영 환경에서는 false로 설정.
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    HabitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) { }

  onModuleInit() {
    initializeFirebase(this.configService);
  }
}
