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

  async register(payload: RegisterDto) {
    const queryRunner = this.connectionStore.getStore()!.queryRunner;
    if (!queryRunner) {
      throw new Error("queryRunner is not defined");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const token = (await randomBytes(16)).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    let user;

    try {
      await queryRunner.startTransaction();

      user = await this.usersService.createUser({
        email: payload.email,
        password: hashedPassword,
      });

      await this.evtRepository.create({ token: hashedToken, user });

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    }

    const sendEmailPayload: SendEmailPayload = {
      userId: user.id,
      tenantId: "tenant x",
      payload: {
        type: emailTypes.ACCOUNT_CONFIRMATION,
        email: user.email,
        link: `https://wwww.blaa.com/email-confirmation?token=${token}`,
        firstName: "John",
        lastName: "Cena"
      },
    };

    this.emailService.emit(EventPatterns.SEND_EMAIL, sendEmailPayload);
  }
}
