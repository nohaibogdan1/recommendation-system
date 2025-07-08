import { Module } from "@nestjs/common";
import ConfigurationModule from "./configuration/configuration.module";
import AppController from "./app.controller";
import CommunicationModule from "./communication/communication.module";

@Module({
  imports: [
    ConfigurationModule, CommunicationModule
  ],
  controllers: [AppController],
})
export default class AppModule {}
