import joi from "joi";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        HTTP_PORT: joi.number().required(),
        SMTP_HOST: joi.string().required(),
        SMTP_PORT: joi.number().required(),
        SMTP_USER: joi.string().required(),
        SMTP_PASSWORD: joi.string().required(),
        FROM: joi.string().required(),
      }),
    }),
  ],
})
export default class ConfigurationModule {}
