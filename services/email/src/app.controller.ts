import { Controller, Get, Post, Inject } from "@nestjs/common";
import { EventPattern, Transport, ClientProxy } from "@nestjs/microservices";
import TemplateService from "./template/template.service";
import CommunicationService from "./communication/communication.service";

@Controller("email")
export default class AppController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly communicationService: CommunicationService
  ) {}

  @EventPattern("email.a", Transport.RMQ)
  xx(data: any, c: any) {
    console.log("\n\nuee\n\n", data);
    return "rfse";
  }

  @EventPattern("email.b", Transport.RMQ)
  xx2(data: any, c: any) {
    console.log("\n\nuedde\n\n", data);
    return "rfse";
  }

  @Post()
  async xx_HTTP() {
    console.log("\n\nhttp wee\n\n");

    const html = await this.templateService.createTemplate();
    this.communicationService.send({
      to: "dawd@df.com",
      subject: "Hello",
      text: "gsrsg",
      html,
    });
  }
}
