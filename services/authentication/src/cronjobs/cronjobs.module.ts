import { Module } from "@nestjs/common";
import AuthenticationModule from "../authentication/authentication.module";
import CronjobsService from "./cronjobs.service";

@Module({
  imports: [AuthenticationModule],
  providers: [CronjobsService],
})
export default class CronjobsModule {}
