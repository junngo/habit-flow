import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'habitflow_user',
      password: 'habitflow_password',
      database: 'habitflow_db',
      entities: [],
      synchronize: true, // 개발 환경에서만 사용. 운영 환경에서는 false로 설정.
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
