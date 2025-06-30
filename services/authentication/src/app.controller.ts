import { Controller, Get } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("hero") 
export default class AppController {

    @GrpcMethod("HeroesService", "findOne") 
    findOne(data: any) {
        console.log("")

        return {
            id: 23,
            name: "HEEEROOO"
        }
    }

    @Get() 
    findOneRest() {
        return 24;
    }
}