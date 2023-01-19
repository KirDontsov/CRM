import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // конфигурация стратегии
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    // если пароль или имя не подходит выкидываем эксепшн
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
