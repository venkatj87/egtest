import { Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
    }>;
}
export {};
