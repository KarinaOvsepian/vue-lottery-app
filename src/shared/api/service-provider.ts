import { UserService } from '../../entities/user/api/user.service.ts';
import { AuthService } from '../../auth.service.ts';

export class ServiceProvider {
  private static userService?: UserService;
  private static authService?: AuthService;

  static get users(): UserService {
    this.userService ??= new UserService();
    return this.userService;
  }

  static get auth(): AuthService {
    this.authService ??= new AuthService();
    return this.authService;
  }
}
