import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt'; // JwtService 임포트
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  const usersRepository = {
    findOne: jest.fn(), // UsersRepository.findOne 메서드
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockJwtToken'), // Mock된 JWT 토큰 반환
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users), // UsersRepository 토큰 제공
          useValue: usersRepository,
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService, // JwtService를 Mock으로 제공
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a new user with hashed password', async () => {
    const userDto = {
      email: 'test@example.com',
      username: 'TestUser',
      password: 'UserPlainPassword',
    };

    // Mock: 중복 이메일 확인
    usersRepository.findOne.mockResolvedValue(null);
    usersRepository.create.mockReturnValue({
      email: userDto.email,
      username: userDto.username,
      password: 'UserHashedPassword',
    });
    usersRepository.save.mockResolvedValue({
      id: 1,
      email: userDto.email,
      username: userDto.username,
      password: 'UserHashedPassword',
      walletAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // // Mock: 비밀번호 해시화
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'UserHashedPassword');

    // // 테스트 실행
    const user = await authService.signup(userDto);

    // 검증
    expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: userDto.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
    expect(usersRepository.create).toHaveBeenCalledWith({
      email: userDto.email,
      username: userDto.username,
      password: 'UserHashedPassword',
    });
    expect(usersRepository.save).toHaveBeenCalledWith({
      email: userDto.email,
      username: userDto.username,
      password: 'UserHashedPassword',
    });
    expect(user).toEqual({
      id: 1,
      email: userDto.email,
      username: userDto.username,
      password: 'UserHashedPassword',
      walletAddress: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
})