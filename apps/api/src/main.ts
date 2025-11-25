import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import path from "path";

async function bootstrap() {
  config({ path: path.resolve(__dirname, "../.env") });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
