/**
 *
 * The purpose of this service:
 * handles authentication for tenants
 * has the required tables
 * offers API keys
 */

import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import AppModule from "./app.module";
import path from "path";
import { glob } from "glob";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const protoFiles = await glob(path.join(__dirname, "./**/*.proto"));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ["hero"],
      protoPath: protoFiles,
    },
  });

  await app.startAllMicroservices();

  await app.listen(3001);
}

bootstrap();
