import { Controller, Get, Post, Inject } from "@nestjs/common";
import {
  EventPattern,
  Transport,
  Payload,
  Ctx,
  RmqContext,
} from "@nestjs/microservices";
import TemplateService from "./template/template.service";
import CommunicationService from "./communication/communication.service";
import EventPatterns from "./eventPatterns";
import { SendEmailPayload } from "./types";
import emailTypes from "./emailTypes";

@Controller("email")
export default class AppController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly communicationService: CommunicationService
  ) {}

  @EventPattern(EventPatterns.SEND_EMAIL, Transport.RMQ)
  async sendEmail(@Payload() data: SendEmailPayload, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();

    try {
      const emailType = data.payload.type;

      let subject = "";

      if (emailType === emailTypes.ACCOUNT_CONFIRMATION) {
        subject = "Email confirmation";
      } else if (emailType === emailTypes.ACCOUNT_REGISTRATION) {
        subject = "Registration .. thank you"
      }

      const html = await this.templateService.createHtml(data.payload);

      await this.communicationService.send({
        to: "dawd@df.com",
        subject,
        text: "",
        html,
      });

      channel.ack(message);
    } catch (e) {
      channel.nack(message);
      console.error(e);
    }
  }

  @Post()
  async xx_HTTP() {
    console.log("\n\nhttp wee\n\n");

    const html = await this.templateService.createHtml({} as any);
    this.communicationService.send({
      to: "dawd@df.com",
      subject: "Hello",
      text: "gsrsg",
      html,
    });
  }
}
