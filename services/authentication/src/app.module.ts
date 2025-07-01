import { Module } from "@nestjs/common";
import AppController from "./app.controller";
import ConfigurationModule from "./configuration/configuration.module";
import UsersModule from "./users/users.module";
import AuthenticationModule from "./authentication/authentication.module";
import DatabaseModule from "./database/database.module";

@Module({
    imports: [ConfigurationModule, DatabaseModule, UsersModule, AuthenticationModule],
    controllers: [AppController],
    providers: []
})
export default class AppModule {}
