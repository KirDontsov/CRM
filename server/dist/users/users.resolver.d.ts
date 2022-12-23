import { UsersService } from './users.service';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(context: any): {
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
