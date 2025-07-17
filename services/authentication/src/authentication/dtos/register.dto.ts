import { IsEmail, IsString } from "class-validator";

export default class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
