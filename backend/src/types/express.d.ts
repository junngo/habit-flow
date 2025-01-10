import { Request } from 'express';
import { DateTime } from 'luxon';

declare module 'express' {
  export interface Request {
    user?: {
      userId: string;   // Firebase UID
      email: string;    // User email
      username: string; // User username
    };
  }
}

declare module 'luxon' {
  const DateTime: any;
}