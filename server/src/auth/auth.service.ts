import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    // декодируем и проверяем хэшированный пароль
    const valid = await compare(password, user.password);
    if (user && valid) {
      const { password: userPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user,
    };
  }

  async signup(signupUserInput: LoginUserInput) {
    const user = await this.usersService.findOne(signupUserInput.username);
    // TODO: unique constraint
    if (user) {
      throw new Error('User already exists');
    }
    // хэшируем пароль
    const password = await hash(signupUserInput.password, 10);
    return this.usersService.create({
      ...signupUserInput,
      password,
    });
  }
}
