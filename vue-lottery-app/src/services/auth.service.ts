import { http } from '@/api/http-client';
import type { LoginCredentials, AuthResponse } from '@/types/auth';
import type { User } from '@/types/user';

export class AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
    });
  }

  getMe(): Promise<User> {
    return http<User>('/auth/me');
  }
}
