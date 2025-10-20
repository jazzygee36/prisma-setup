import { IsString, IsInt, IsEmail, IsEmpty } from 'class-validator';

export class LogineUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
