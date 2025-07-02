import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export default class AuthenticationService {
  constructor(@Inject("EMAIL_SERVICE") private readonly emailService: ClientProxy) {}

  sendEmail() {
    this.emailService.emit("af", "feeee");
  }
}
