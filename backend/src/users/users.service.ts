import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: Partial<Users>): Promise<Users> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
