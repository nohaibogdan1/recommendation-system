import { Controller, Post } from "@nestjs/common";
import AuthenticationService from "./authentication.service";

@Controller("authentication")
export default class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService){}

    @Post("register")
    async register() {
        console.log("\n\ngsg\n\n")
        this.authenticationService.sendEmail();
    } 
}
