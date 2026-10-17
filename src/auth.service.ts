import { http } from '@/shared/api/http-client.ts';
import type { LoginCredentials, AuthResponse } from '@/entities/session/model/auth.type.ts';
import type { User } from '@/entities/user/model/user.ts';

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
