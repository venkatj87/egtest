import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from 'src/interfaces/user.interface';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    signUp(email: string, name: string, password: string): Promise<UserResponse>;
    signIn(email: string, password: string): Promise<UserResponse>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
