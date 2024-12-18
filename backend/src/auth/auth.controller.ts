import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  async signup(@Req() req: Request) {
    const { email, username } = req.user!;
    return this.authService.validateOrCreateUser(email, username);
  }
}
