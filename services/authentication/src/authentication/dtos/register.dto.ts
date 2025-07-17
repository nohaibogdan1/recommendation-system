import { IsEmail } from "class-validator";

export default class RegisterDto {
  @IsEmail()
  email: string;

  password: string;

  firstName: string;

  lastName: string;
}
