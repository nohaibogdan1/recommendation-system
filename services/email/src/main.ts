import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import AppModule from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      exchange: "my_exchange",
      queue: "email",
      wildcards: true,
      noAck: false
    },
  })

  await app.startAllMicroservices();
  await app.listen(configService.get("HTTP_PORT")!);
}

bootstrap();
