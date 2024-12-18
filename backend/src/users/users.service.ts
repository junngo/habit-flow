import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(user: Partial<Users>): Promise<Users> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async upsertUser(email: string, username: string, walletAddress: string): Promise<Users> {
    let user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      // 신규 사용자 추가
      user = this.usersRepository.create({ email, username, walletAddress });
    } else {
      // 기존 사용자 업데이트
      user.walletAddress = walletAddress;
    }

    return await this.usersRepository.save(user);
  }

}
