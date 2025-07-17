import { Controller, Post, Body } from "@nestjs/common";
import AuthenticationService from "./authentication.service";
import RegisterDto from "./dtos/register.dto";

@Controller("authentication")
export default class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  async register(@Body() payload: RegisterDto ) {
    this.authenticationService.register(payload);
  }
}
