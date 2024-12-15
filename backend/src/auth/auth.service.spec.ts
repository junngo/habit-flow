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

  const mockUsersRepository = {
    findOne: jest.fn(), // UsersRepository.findOne 메서드 Mock
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
          useValue: mockUsersRepository,
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
})