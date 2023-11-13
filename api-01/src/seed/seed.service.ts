import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async runSeed() {
    await this.authService.seedView();
    await this.authService.seedRole();
    await this.authService.seedRoleView();
    await this.userService.seedUser();
  }
}
