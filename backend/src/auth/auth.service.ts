import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly usersService: UsersService
  ) { }

  async signup(createUserDto: CreateUserDto): Promise<Users> {
    const { email, password, username } = createUserDto;

    // 이메일 중복 확인
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성 및 저장
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
    });

    return await this.usersRepository.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<Users | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    // 비밀번호 검증은 이후 단계에서 추가
    return user;
  }
}
