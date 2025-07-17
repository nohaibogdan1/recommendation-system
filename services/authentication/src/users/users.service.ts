import { Injectable } from "@nestjs/common";
import UserRepository from "./user.repository";
import User from "./user.entity";
import { DeepPartial } from "typeorm";

@Injectable()
export default class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async createUser(data: DeepPartial<User>) {
    return this.userRepository.create(data);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async confirmEmail(user: User) {
    return this.userRepository.updateUser(user);
  }
}
