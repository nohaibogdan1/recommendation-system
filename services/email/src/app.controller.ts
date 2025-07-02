import { Controller, Get, Post } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

@Controller("email")
export default class AppController {
  @EventPattern("af")
  xx(data: any) {
    console.log("\n\nuee\n\n", data);
    return "rfse";
  }

  @Post()
  xx_HTTP() {
    console.log("\n\nhttp wee\n\n");
    return "rfffse";
  }
}
