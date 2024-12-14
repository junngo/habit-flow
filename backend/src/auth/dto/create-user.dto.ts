import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(10, 20) // 비밀번호 최소/최대 길이 제한
  password: string;

  @IsString()
  username?: string;
}
