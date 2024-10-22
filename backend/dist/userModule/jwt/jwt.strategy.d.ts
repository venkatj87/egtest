import { Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/interfaces/jwt.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
    }>;
}
export {};
