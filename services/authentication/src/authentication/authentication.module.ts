import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import AuthenticationService from "./authentication.service";
import AuthenticationController from "./authentication.controller";
import EmailVerificationToken from "./emailVerificationToken.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationToken])],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export default class AuthenticationModule {}
