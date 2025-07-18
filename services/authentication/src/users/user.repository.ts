import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, QueryRunner, Repository } from "typeorm";
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

  private getRepository() {
    return (
      this.connectionStore
        .getStore()
        ?.queryRunner.manager.getRepository(User) || this.userRepository
    );
  }

  async create(data: DeepPartial<User>) {
    const repository = this.getRepository();

    const userEntity = repository.create({
      ...data,
    });
    return repository.save(userEntity);
  }

  async getUserByEmail(email: string) {
    return this.getRepository().findOne({
      relations: { emailVerificationToken: true },
      where: { email },
    });
  }

  async getUserById(id: string) {
    return this.getRepository().findOneBy({ id });
  }

  async updateUser(user: User) {
    return this.getRepository().save(user);
  }
}
