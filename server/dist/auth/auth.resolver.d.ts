import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { User } from '../users/entities/user.entity';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(loginUserInput: LoginUserInput, context: any): Promise<{
        access_token: string;
        user: User;
    }>;
    signup(signupUserInput: LoginUserInput): Promise<{
        id: number;
        username: string;
        password: string;
    }>;
}
