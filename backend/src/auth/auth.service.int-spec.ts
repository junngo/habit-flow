import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDatabaseConfig } from 'src/test-database-config';
import { Users } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthService - Integration Test', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule, // 실제 Users 모듈
        TypeOrmModule.forRoot(testDatabaseConfig), // 실제 DB 연결
        TypeOrmModule.forFeature([Users]), // Users 엔티티 등록
      ],
      providers: [
        AuthService,
        {
          provide: JwtService, // JwtService의 Mock 제공
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'), // Mock된 JWT 토큰 반환
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should create a new user in the database', async () => {
    const userDto = {
      email: 'test@example.com',
      username: 'TestUser',
      password: 'UserPlainPassword',
    };

    const user = await authService.signup(userDto);

    expect(user).toBeDefined();
    expect(user.email).toBe(userDto.email);
    expect(user.username).toBe(userDto.username);
    expect(user.password).not.toBe(userDto.password); // 비밀번호가 해시되었는지 확인
  });
});
