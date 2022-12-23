import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user.input';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: User): Promise<{
        access_token: string;
        user: User;
    }>;
    signup(signupUserInput: LoginUserInput): Promise<{
        id: number;
        username: string;
        password: string;
    }>;
}
