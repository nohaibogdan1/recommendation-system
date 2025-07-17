import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { ClientRMQ } from "@nestjs/microservices";

@Injectable()
export default class RmqSetupService implements OnModuleInit {
  constructor(
    @Inject("EMAIL_SERVICE") private readonly emailService: ClientRMQ
  ) {}

  async onModuleInit() {
    try {
      await this.emailService.connect();
      await this.emailService.createChannel();
      await this.emailService.close();
    } catch (e) {
      console.error(e);
    }
  }
}
