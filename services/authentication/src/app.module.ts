import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import AppController from "./app.controller";
import ConfigurationModule from "./configuration/configuration.module";
import UsersModule from "./users/users.module";
import AuthenticationModule from "./authentication/authentication.module";
import DatabaseModule from "./database/database.module";
import ConnectionStoreModule from "./database/ConnectionStoreModule";
import QueryRunnerMiddleware from "./database/QueryRunnerMiddleware";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    ConnectionStoreModule,
  ],
  controllers: [AppController],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryRunnerMiddleware).forRoutes("*");
  }
}
