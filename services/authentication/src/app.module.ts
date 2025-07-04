import { Module } from "@nestjs/common";
import AppController from "./app.controller";

@Module({
    controllers: [AppController],
    providers: []
})
export default class AppModule {}
