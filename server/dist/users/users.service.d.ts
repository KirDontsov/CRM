import { CreateUserInput } from './dto/create-user.input';
export declare class UsersService {
    private readonly users;
    create(createUserInput: CreateUserInput): {
        id: number;
        username: string;
        password: string;
    };
    findAll(): {
        id: number;
        username: string;
        password: string;
    }[];
    findOne(username: string): {
        id: number;
        username: string;
        password: string;
    };
}
