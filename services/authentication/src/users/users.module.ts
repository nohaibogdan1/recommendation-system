import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import UsersService from "./users.service";
import User from "./user.entity";
import UserRepository from "./user.repository";
import ConnectionStoreModule from "../database/ConnectionStoreModule";

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConnectionStoreModule],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export default class UsersModule {}
