import { Controller, Get, Post, Inject } from "@nestjs/common";
import { EventPattern, Transport, ClientProxy } from "@nestjs/microservices";

@Controller("email")
export default class AppController {
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
  xx_HTTP() {
    console.log("\n\nhttp wee\n\n");
    return "rfffse";
  }
}
