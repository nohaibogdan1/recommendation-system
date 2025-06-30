import { Module } from "@nestjs/common";
import path from "path";
import { ClientsModule, Transport } from "@nestjs/microservices";
import AppController from "./app.controller";

@Module({
    imports: [
        ClientsModule.register([{
            name: "HERO_PACKAGE",
            transport: Transport.GRPC,
            options: {
                package: "hero",
                protoPath: path.join(__dirname, "./hero/hero.proto"),
                
            }
        }])
    ],
    controllers: [AppController]
})
export default class AppModule {}
