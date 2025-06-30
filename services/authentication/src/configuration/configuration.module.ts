import joi from "joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        POSTGRES_HOST: joi.string().required(),
        POSTGRES_USER: joi.string().required(),
        POSTGRES_PASSWORD: joi.string().required(),
        POSTGRES_PORT: joi.number().required(),
        POSTGRES_DB: joi.string().required(),
      }),
    }),
  ],
})
export default class ConfigurationModule {}
