import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import JwtRefreshTokenService from "./jwtRefreshToken.service";

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
      provide: JwtRefreshTokenService,
      useExisting: JwtService,
    },
  ],
  exports: [JwtRefreshTokenService],
})
export default class JwtRefreshTokenModule {}
