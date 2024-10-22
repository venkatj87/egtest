import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './userController';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [  
    // TypeOrmModule for User entity
    TypeOrmModule.forFeature([User]),
    
    // JwtModule with ConfigService to manage secret and expiration via environment variables
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}