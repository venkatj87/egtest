import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './userController';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService

@Module({
  imports: [
    // ConfigModule allows reading environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // TypeOrmModule for User entity
    TypeOrmModule.forFeature([User]),
    
    // JwtModule with ConfigService to manage secret and expiration via environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}