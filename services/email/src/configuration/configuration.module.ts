import joi from "joi";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        HTTP_PORT: joi.number().required(),
        FAKE_SMTP_PORT: joi.number().required(),
      }),
    }),
  ],
})
export default class ConfigurationModule {}
