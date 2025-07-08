import { Controller, Post } from "@nestjs/common";
import CommunicationService from "./communication.service";

@Controller("communication")
export default class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post()
  send() {
    this.communicationService.send({
      to: "dawd@df.com",
      subject: "Hello",
      text: "gsrsg",
      html: "<h1>awd</h1><button>Clicke me</button>"
    });
  }
}
