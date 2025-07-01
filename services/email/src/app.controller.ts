import { Controller, Get } from "@nestjs/common";

@Controller("hello")
export default class AppController {
    @Get()
    get() {
        console.log("uee");
        return "rfse";
    }
}