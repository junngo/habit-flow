import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { Request } from 'express';
import admin from "./firebase-admin"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  async signup(@Req() req: Request) {
    const { email, username, userId: external_uid } = req.user!;
    return this.authService.validateOrCreateUser(email, username, external_uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('verify-token')
  async verifyToken(@Req() req: Request) {
    const { userId: external_uid } = req.user!;

    try {
      const customToken = await admin.auth().createCustomToken(external_uid);
      console.log("customToken: ", customToken);
      return {
        status: 'success',
        message: 'Token is valid',
        user: req.user,
        customToken: customToken
      };
    } catch (error) {
      console.error('Firebase token verification failed:', error.message);
    }
  }
}
