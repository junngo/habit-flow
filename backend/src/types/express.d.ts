import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: string;   // Firebase UID
      email: string;    // User email
      username: string; // User username
    };
  }
}
