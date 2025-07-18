import { IsEmail } from "class-validator";

export default class LoginDto {
  @IsEmail()
  email: string;

  password: string;
}
