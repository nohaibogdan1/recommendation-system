import { promisify } from "node:util";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { QueryRunner } from "typeorm";
import { ClientRMQ } from "@nestjs/microservices";
import RegisterDto from "./dtos/register.dto";
import UsersService from "../users/users.service";
import { AsyncLocalStorage } from "node:async_hooks";
import EvtRepository from "./evt.repository";
import { SendEmailPayload } from "../types";
import emailTypes from "../emailTypes";
import EventPatterns from "../eventPatterns";
import EmailConfirmationDto from "./dtos/emailConfirmation.dto";
import { hasExpired } from "./utils";
import { EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN } from "./consts";

const randomBytes = promisify(crypto.randomBytes);

@Injectable()
export default class AuthenticationService {
  constructor(
    @Inject("EMAIL_SERVICE") private readonly emailService: ClientRMQ,
    private readonly evtRepository: EvtRepository,
    private readonly usersService: UsersService,
    @Inject("ConnectionStore")
    private readonly connectionStore: AsyncLocalStorage<{
      queryRunner: QueryRunner;
    }>
  ) {}

  private getQueryRunner() {
    const queryRunner = this.connectionStore.getStore()!.queryRunner;
    if (!queryRunner) {
      throw new Error("queryRunner is not defined");
    }
    return queryRunner;
  }

  async register(payload: RegisterDto) {
    const queryRunner = this.getQueryRunner();

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const token = (await randomBytes(16)).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    let user;

    try {
      await queryRunner.startTransaction();

      user = await this.usersService.createUser({
        email: payload.email,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
      });

      await this.evtRepository.create({ token: hashedToken, user });

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    }

    queryRunner.release();

    const sendEmailPayload: SendEmailPayload = {
      userId: user.id,
      tenantId: "tenant x",
      payload: {
        type: emailTypes.ACCOUNT_CONFIRMATION,
        email: user.email,
        link: `https://wwww.blaa.com/email-confirmation?token=${token}`,
        firstName: "John",
        lastName: "Cena",
      },
    };

    this.emailService.emit(EventPatterns.SEND_EMAIL, sendEmailPayload);
  }

  async confirmEmail(payload: EmailConfirmationDto) {
    const user = await this.usersService.getUserByEmail(payload.email);

    if (!user || !user.emailVerificationToken) {
      //return invalid user or token

      return;
    }

    const evt = user.emailVerificationToken;

    const hashedToken = crypto
      .createHash("sha256")
      .update(payload.token)
      .digest("hex");

    if (evt.token !== hashedToken || hasExpired(evt.createdAt, EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN) ) {
      // token not valid
      return;
    }

    user.emailVerified = true;

    const queryRunner = this.getQueryRunner();

    await queryRunner.startTransaction();

    try {
      await this.usersService.confirmEmail(user);
      await this.evtRepository.remove(user.emailVerificationToken);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    }
    queryRunner.release();
  }
}
