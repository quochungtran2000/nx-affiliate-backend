import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { merchantProviders } from './providers/merchant-providers';
import { MerchantRepository } from './repository/merchant-repository';
import { AccessTraderService } from './services/access-trader-service';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.local' : `.env.${ENV}`,
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule.register({
      maxRedirects: 5,
      timeout: 5000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AccessTraderService, MerchantRepository, ...merchantProviders],
})
export class AppModule {}
