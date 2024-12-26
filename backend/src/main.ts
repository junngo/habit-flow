import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS 설정: localhost:3000에서의 요청을 허용
  app.enableCors({
    origin: 'http://localhost:3000', // CORS 허용할 도메인
    methods: 'GET,POST,PUT,DELETE',  // 허용할 HTTP 메소드
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더
  });
  app.useGlobalPipes(new ValidationPipe());         // DTO 유효성 검사 활성화
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
