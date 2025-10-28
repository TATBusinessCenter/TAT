import { Request } from 'express';

export interface AuthTokenPayload {
  sub: number;
  role: string;
  name?: string | null;
  email?: string;
}

export interface AuthenticatedRequest<T = any> extends Request {
  user?: AuthTokenPayload;
  body: T;
}
