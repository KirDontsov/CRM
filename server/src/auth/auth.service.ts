import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByName(username);
    // декодируем и проверяем хэшированный пароль
    const valid = await compare(password, user.password);

    if (user && valid) {
      const { id, username: userName, email, roles } = user;
      return { id, username: userName, email, roles };
    }
    return null;
  }

  async login(user: User) {
    const { id } = user;

    return {
      access_token: this.jwtService.sign({
        ...user,
        sub: id,
      }),
      user,
    };
  }

  async signup(createUserInput: CreateUserInput) {
    const user = await this.usersService.getUserByName(
      createUserInput.username,
    );
    // TODO: unique constraint
    if (user) {
      throw new Error('User already exists');
    }
    // хэшируем пароль
    const password = await hash(createUserInput.password, 10);
    return this.usersService.createUser({
      ...createUserInput,
      password,
    });
  }
}
