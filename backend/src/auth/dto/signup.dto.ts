import { IsEmail, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
