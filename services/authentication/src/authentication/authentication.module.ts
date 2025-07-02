import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport} from "@nestjs/microservices";
 
import AuthenticationService from "./authentication.service";
import AuthenticationController from "./authentication.controller";
import EmailVerificationToken from "./emailVerificationToken.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerificationToken]),
    ClientsModule.register([{
      name: "EMAIL_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: "email"
      }
    }])
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export default class AuthenticationModule {}
