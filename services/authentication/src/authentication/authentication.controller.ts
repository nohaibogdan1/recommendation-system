import { Controller, Post, Body } from "@nestjs/common";
import AuthenticationService from "./authentication.service";
import RegisterDto from "./dtos/register.dto";
import EmailConfirmationDto from "./dtos/emailConfirmation.dto";
import LoginDto from "./login.dto";
import RedoEmailConfirmationDto from "./dtos/redoEmailConfirmation.dto";
import GenerateJwtDto from "./dtos/generateJwt.dto";

@Controller("authentication")
export default class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  async register(@Body() payload: RegisterDto ) {
    return this.authenticationService.register(payload);
  }

  @Post("email-confirmation")
  async emailConfirmation(@Body() payload: EmailConfirmationDto ) {
    return this.authenticationService.confirmEmail(payload);
  }

  @Post("resend-email-verification-token")
  async resentEmailVerificationToken(@Body() payload: RedoEmailConfirmationDto) {
    return this.authenticationService.redoEmailVerification(payload);
  }

  @Post("login")
  async login(@Body() payload: LoginDto) {
    return this.authenticationService.login(payload);
  }

  @Post("generate-jwt") 
  async generateJwt(@Body() payload: GenerateJwtDto) {
    return this.authenticationService.generateJwt(payload);
  }

  @Post("validate-jwt")
  async validateJwt() {
    // validate jwt
    // return user based on jwt
  }
}
