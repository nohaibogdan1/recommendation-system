import { Module } from "@nestjs/common";
import ConfigurationModule from "./configuration/configuration.module";
import AppController from "./app.controller";

@Module({
  imports: [ConfigurationModule],
  controllers: [AppController]
})
export default class AppModule {}
