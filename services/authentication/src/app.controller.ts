import { Controller, Get } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { hero } from "./hero/proto/hero";

@Controller("hero") 
export default class AppController {

    @GrpcMethod("HeroesService", "findOne") 
    findOne(data: hero.HeroById) {
        console.log("\n\ndata.getId", data.id, data.id ,"\n\n")

        return {
            id: 23,
            name: "HEEEROOffO"
        }
    }

    @Get() 
    findOneRest() {
        return 24;
    }
}