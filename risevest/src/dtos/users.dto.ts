import { Roles } from '@/interfaces/users.interface';
import { IsString, IsEmail, Allow } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public username: string;

  @Allow()
  public role: Roles;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
