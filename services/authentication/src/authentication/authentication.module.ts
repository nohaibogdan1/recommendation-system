import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";

import AuthenticationService from "./authentication.service";
import AuthenticationController from "./authentication.controller";
import EmailVerificationToken from "./emailVerificationToken.entity";
import RmqSetupService from "./RmqSetupService";
import UsersModule from "../users/users.module";
import ConnectionStoreModule from "../database/ConnectionStoreModule";
import EvtRepository from "./evt.repository";
import RefreshToken from "./deadRefreshToken.entity";
import JwtJwtModule from "./jwt/jwtJwt/jwtJwt.module";
import JwtRefreshTokenModule from "./jwt/jwtRefreshToken/jwtRefreshToken.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerificationToken, RefreshToken]),
    ClientsModule.register([
      {
        name: "EMAIL_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          exchange: "my_exchange",
          exchangeType: "topic",
          wildcards: true,
        },
      },
    ]),
    UsersModule,
    ConnectionStoreModule,
    JwtJwtModule,
    JwtRefreshTokenModule
  ],
  providers: [AuthenticationService, RmqSetupService, EvtRepository],
  controllers: [AuthenticationController],
})
export default class AuthenticationModule {}
