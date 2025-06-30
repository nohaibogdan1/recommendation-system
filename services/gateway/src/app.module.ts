import { Module } from "@nestjs/common";
import path from "path";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { glob } from "glob";

import AppController from "./app.controller";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "HERO_PACKAGE",
        useFactory: async () => {
          const protoFiles = await glob(path.join(__dirname, "./**/*.proto"));
          return {
            transport: Transport.GRPC,
            options: {
              package: ["hero"],
              protoPath: protoFiles,
            },
          };
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export default class AppModule {}
