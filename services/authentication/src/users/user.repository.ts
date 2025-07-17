import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { AsyncLocalStorage } from "async_hooks";
import User from "./user.entity";

@Injectable()
export default class UserRepository {
  constructor(
    @Inject("ConnectionStore")
    private readonly connectionStore: AsyncLocalStorage<{
      queryRunner: QueryRunner;
    }>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(data: { email: string; password: string }) {
    const repository =
      this.connectionStore
        .getStore()
        ?.queryRunner.manager.getRepository(User) || this.userRepository;

    const userEntity = repository.create({
      ...data,
    });
    const user = await repository.save(userEntity);
    return user;
  }
}
