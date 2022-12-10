/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { config } from './app/config/configuration';

async function bootstrap() {
  const logger = new Logger(`MicroService-AccessTrader`);
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: config.redis.url,
      retryAttempts: 5,
      retryDelay: 1000 * 10,
    },
  });
  
  await app.startAllMicroservices();
  
  const port = config.service.port;

  await app.listen(port);

  logger.log(`Microservice AccessTrader is listening...`);
}

bootstrap();
