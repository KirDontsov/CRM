import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
      logging: true,
    });
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  async validate(payload: any) {
    // декодируем JWT
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
