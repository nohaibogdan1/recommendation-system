import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import AppController from "./app.controller";
import ConfigurationModule from "./configuration/configuration.module";
import UsersModule from "./users/users.module";
import AuthenticationModule from "./authentication/authentication.module";
import DatabaseModule from "./database/database.module";
import ConnectionStoreModule from "./database/ConnectionStoreModule";
import QueryRunnerMiddleware from "./database/QueryRunnerMiddleware";
import CronjobsModule from "./cronjobs/cronjobs.module";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    ConnectionStoreModule,
    ScheduleModule.forRoot(),
    CronjobsModule
  ],
  controllers: [AppController],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryRunnerMiddleware).forRoutes("*");
  }
}
