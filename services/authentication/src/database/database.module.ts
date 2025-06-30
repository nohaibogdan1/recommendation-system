import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: ({ configService: ConfigService }) => ({
        type: "postgres",
        database: ConfigService.get("POSTGRES_DB"),
        host: ConfigService.get("POSTGRES_HOST"),
        username: ConfigService.get("POSTGRES_USER"),
        password: ConfigService.get("POSTGRES_PASSWORD"),
        port: ConfigService.get("POSTGRES_PORT"),
        entities: [__dirname + "../**/*.entity.{ts,js}"],
      }),
    }),
  ],
})
export default class DatabaseModule {}
