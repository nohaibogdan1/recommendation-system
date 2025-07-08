import { Inject, Injectable } from "@nestjs/common";
import { ClientRMQ } from "@nestjs/microservices";

@Injectable()
export default class AuthenticationService {
  constructor(
    @Inject("EMAIL_SERVICE") private readonly emailService: ClientRMQ
  ) {}

  async sendEmail() {
    this.emailService.emit("ddsf", {
      userId: "1",
      tenantId: "tenant 1",
      payload: {
        a: "2",
        b: "4",
        c: "5"
      }
    });
  }
}
