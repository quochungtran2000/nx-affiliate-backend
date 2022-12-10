/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger(`MicroService-AccessTrader`);
  const port = process.env.PORT || 3334;

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
      retryAttempts: 5,
      retryDelay: 1000 * 10,
    },
  });

  await app.startAllMicroservices();


  await app.listen(port);

  logger.log(`Microservice AccessTrader is listening...`);
}

bootstrap();
