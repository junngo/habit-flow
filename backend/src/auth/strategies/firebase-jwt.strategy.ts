import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import admin from '../firebase-admin';

@Injectable()
export class FirebaseJwtStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
  constructor() {
    super();
  }

  async validate(req: any): Promise<any> {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No JWT token found');
    }

    const token = authHeader.split(' ')[1]; // Bearer 이후 토큰 추출
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        userId: decodedToken.uid,
        email: decodedToken.email,
        username: decodedToken.name || 'Anonymous',
      };
    } catch (error) {
      console.error('Firebase token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
