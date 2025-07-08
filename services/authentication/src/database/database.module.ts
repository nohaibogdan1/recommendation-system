import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        database: configService.get("POSTGRES_DB"),
        host: configService.get("POSTGRES_HOST"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        port: configService.get("POSTGRES_PORT"),
        entities: [__dirname + "../**/*.entity.{ts,js}"],
        synchronize: configService.get("DB_SYNC") || false,
      }),
    }),
  ],
})
export default class DatabaseModule {}
