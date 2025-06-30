import { Module } from "@nestjs/common";
import AppController from "./app.controller";
import ConfigurationModule from "./configuration/configuration.module";

@Module({
    imports: [ConfigurationModule],
    controllers: [AppController],
    providers: []
})
export default class AppModule {}
