import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import JsonWebTokenService from "./jsonWebToken.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_EXPIRATION")}m`,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: JsonWebTokenService,
      useExisting: JwtService,
    },
  ],
  exports: [JsonWebTokenService],
})
export default class JsonWebTokenModule {}
