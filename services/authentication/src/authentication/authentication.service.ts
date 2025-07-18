import { promisify } from "node:util";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { QueryRunner, Repository } from "typeorm";
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
import LoginDto from "./login.dto";
import RedoEmailConfirmationDto from "./dtos/redoEmailConfirmation.dto";
import GenerateJwtDto from "./dtos/generateJwt.dto";
import { JwtPayload, RefreshTokenPayload } from "./types";
import { InjectRepository } from "@nestjs/typeorm";
import RefreshToken from "./refreshToken.entity";
import JwtRefreshTokenService from "./jwt/jwtRefreshToken/jwtRefreshToken.service";
import JwtJwtService from "./jwt/jwtJwt/jwtJwt.service";

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
    }>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtRefreshTokenService: JwtRefreshTokenService,
    private readonly jwtJwtService: JwtJwtService
  ) {}

  private getQueryRunner() {
    const queryRunner = this.connectionStore.getStore()!.queryRunner;
    if (!queryRunner) {
      throw new Error("queryRunner is not defined");
    }
    return queryRunner;
  }

  async generateEmailVerificationToken() {
    const token = (await randomBytes(16)).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    return { token, hashedToken };
  }

  async redoEmailVerification(payload: RedoEmailConfirmationDto) {
    const { email } = payload;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const { token, hashedToken } = await this.generateEmailVerificationToken();

    const queryRunner = this.getQueryRunner();

    try {
      queryRunner.startTransaction();

      await this.evtRepository.remove(user.emailVerificationToken);
      await this.evtRepository.create({
        token: hashedToken,
        user,
      });

      queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      queryRunner.rollbackTransaction();
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
        lastName: "Cena",
      },
    };

    this.emailService.emit(EventPatterns.SEND_EMAIL, sendEmailPayload);
  }

  async register(payload: RegisterDto) {
    const queryRunner = this.getQueryRunner();

    const { token, hashedToken } = await this.generateEmailVerificationToken();
    const hashedPassword = await bcrypt.hash(payload.password, 10);
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
        type: emailTypes.ACCOUNT_REGISTRATION,
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

    if (
      evt.token !== hashedToken ||
      hasExpired(evt.createdAt, EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN)
    ) {
      // token not valid
      return;
    }

    user.emailVerified = true;

    const queryRunner = this.getQueryRunner();

    await queryRunner.startTransaction();

    try {
      await this.usersService.updateUser(user);
      await this.evtRepository.remove(user.emailVerificationToken);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    }
    queryRunner.release();
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user || !user.emailVerified) {
      throw new ForbiddenException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException();
    }

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
    };

    const refreshToken =
      await this.jwtRefreshTokenService.signAsync(refreshTokenPayload);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: hashedRefreshToken,
      user,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return refreshToken;
  }

  async generateJwt({ refreshToken }: GenerateJwtDto) {
    let userId;
    try {
      const payload: RefreshTokenPayload =
        await this.jwtRefreshTokenService.verifyAsync(refreshToken);
      userId = payload.userId;
    } catch (e) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenEntity = await this.refreshTokenRepository.findBy({
      token: hashedRefreshToken,
    });
    if (!refreshTokenEntity) {
      throw new UnauthorizedException();
    }

    const jwtPayload: JwtPayload = {
      userId,
    };
    return await this.jwtJwtService.signAsync(jwtPayload);
  }
}
