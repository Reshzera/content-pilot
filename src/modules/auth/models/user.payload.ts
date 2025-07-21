export interface UserPayload {
  sub: string;
  sessionId: string;
  email: string;
  iat?: number;
  exp?: number;
}
