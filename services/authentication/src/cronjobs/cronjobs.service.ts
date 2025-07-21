import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import AuthenticationService from "../authentication/authentication.service";

@Injectable()
export default class CronjobsService {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  cleanDeadRefreshTokens() {
    this.authenticationService.cleanDeadRefreshTokens();
  }
}
