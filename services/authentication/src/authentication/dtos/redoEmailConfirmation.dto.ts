import { IsEmail } from "class-validator";

export default class RedoEmailConfirmationDto {
    @IsEmail()
    email: string;
}