import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) { }

  async validateOrCreateUser(email: string, username: string): Promise<Users> {

    // 이메일로 유저 찾기
    let user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      // 유저가 없다면 새로 생성
      user = this.usersRepository.create({ email, username });
      user = await this.usersRepository.save(user);
    }

    return user;
  }
}
