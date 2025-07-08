import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport} from "@nestjs/microservices";
 
import AuthenticationService from "./authentication.service";
import AuthenticationController from "./authentication.controller";
import EmailVerificationToken from "./emailVerificationToken.entity";
import RmqSetupService from "./RmqSetupService";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerificationToken]),
    ClientsModule.register([{
      name: "EMAIL_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        exchange: "my_exchange",
        exchangeType: "topic",
        wildcards: true,
      }
    }])
  ],
  providers: [AuthenticationService, RmqSetupService],
  controllers: [AuthenticationController],
})
export default class AuthenticationModule {}
