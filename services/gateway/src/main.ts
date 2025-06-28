/**
 *
 * Roles for this application:
 *  - Offers to clients the REST API for all workflows
 *  - limits requests per IP
 *
 */

/**
 *
 * registration flow
 * jwt and refresh tokens
 * one user has multiple applications, each one is a tenant
 * table with API keys for applications
 * table with users
 *
 * database with schemas for every tenant
 */

import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
