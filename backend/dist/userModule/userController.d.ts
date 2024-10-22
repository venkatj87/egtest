import { UserService } from "./user.service";
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { RefreshTokenDto } from "./dto/refresh-token.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signUp(signupUserDto: SignupUserDto): Promise<import("../interfaces/user.interface").UserResponse>;
    signIn(singinUserDto: SigninUserDto): Promise<import("../interfaces/user.interface").UserResponse>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
}
