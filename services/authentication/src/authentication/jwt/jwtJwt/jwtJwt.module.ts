import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import JwtJwtService from "./jwtJwt.service";

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
      provide: JwtJwtService,
      useExisting: JwtService,
    },
  ],
  exports: [JwtJwtService],
})
export default class JwtJwtModule {}
