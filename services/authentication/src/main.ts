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

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: "hero",
            protoPath: path.join(__dirname, "./hero/hero.proto"),
        }
    });

    await app.startAllMicroservices();

    await app.listen(3001);
}

bootstrap();
