import { Injectable } from "@nestjs/common";
import UserRepository from "./user.repository";

@Injectable()
export default class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async createUser(data: { email: string; password: string }) {
    return this.userRepository.create(data);
  }
}
