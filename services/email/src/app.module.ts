import { Module } from "@nestjs/common";
import ConfigurationModule from "./configuration/configuration.module";
import AppController from "./app.controller";
import CommunicationModule from "./communication/communication.module";
import TemplateModule from "./template/template.module";

// TODO: create a logger that sends logs to an endpoint created by a logstash pipeline

@Module({
  imports: [
    ConfigurationModule, CommunicationModule, TemplateModule
  ],
  controllers: [AppController],
})
export default class AppModule {}
