import { Controller, Post, Body, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { RefreshTokenDto } from "./dto/refresh-token.dto";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signUp(
      @Body(new ValidationPipe()) signupUserDto: SignupUserDto,  // Validation added here
    ) {
      return this.userService.signUp(signupUserDto.email, signupUserDto.name, signupUserDto.password);
    }
  
    @Post('signin')
    async signIn(
      @Body(new ValidationPipe()) singinUserDto: SigninUserDto, 
    ) {
      return this.userService.signIn(singinUserDto.email, singinUserDto.password);
    }

    @Post('refresh-token')
    async refreshToken(
      @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
    ){
      return this.userService.refreshToken(refreshTokenDto.refreshToken);
    }
}