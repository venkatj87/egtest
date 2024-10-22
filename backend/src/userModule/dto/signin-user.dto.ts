import { IsEmail, IsString } from 'class-validator';

export class SigninUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  password: string;
}
