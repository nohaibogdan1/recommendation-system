import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import EmailVerificationToken from "./emailVerificationToken.entity";
import { AsyncLocalStorage } from "async_hooks";
import User from "../users/user.entity";

@Injectable()
export default class EvtRepository {
  constructor(
    @Inject("ConnectionStore")
    private readonly connectionStore: AsyncLocalStorage<{
      queryRunner: QueryRunner;
    }>,
    @InjectRepository(EmailVerificationToken)
    private readonly evtRepository: Repository<EmailVerificationToken>
  ) {}

  async create(data: { token: string, user: User }) {
    const repository =
      this.connectionStore
        .getStore()
        ?.queryRunner.manager.getRepository(EmailVerificationToken) ||
      this.evtRepository;
    const token = repository.create(data);
    await repository.save(token);
    return token;
  }
}
