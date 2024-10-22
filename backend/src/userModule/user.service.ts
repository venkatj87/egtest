import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponse } from 'src/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // `readonly` added for immutability
  ) {}

  async signUp(
    email: string,
    name: string,
    password: string,
  ): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, name, password: hashedPassword });
    const userResponse = await this.userRepository.save(user);

    // Create JWT access and refresh tokens
    const payload = { email: userResponse.email, sub: userResponse._id };
    
    // expiry time can be move to config file to make sure all config in file for the future changes.
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    // Save refresh token in the database
    userResponse.refreshToken = refreshToken;
    await this.userRepository.save(userResponse);

    // Return response to the client
    return {
      _id: userResponse._id,
      email: userResponse.email,
      name: userResponse.name,
      accessToken,
      refreshToken,
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<UserResponse> {
    try {

    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }
    // Verify user existence and compare passwords
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

      // Save refresh token in the database
      user.refreshToken = refreshToken;
      await this.userRepository.save(user);

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      };
    } catch(error) {
      console.error('Error during signIn: ', error.message || error);
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw the UnauthorizedException
      }
      throw new BadRequestException('An error occurred during sign-in');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { email: decoded.email } });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Create a new access token
      const payload = { email: user.email, sub: user._id };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}