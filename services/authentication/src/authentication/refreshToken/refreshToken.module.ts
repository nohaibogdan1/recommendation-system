import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import RefreshTokenService from "./refreshToken.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("REFRESH_TOKEN_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("REFRESH_TOKEN_EXPIRATION")}m`,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: RefreshTokenService,
      useExisting: JwtService,
    },
  ],
  exports: [RefreshTokenService],
})
export default class RefreshTokenModule {}
