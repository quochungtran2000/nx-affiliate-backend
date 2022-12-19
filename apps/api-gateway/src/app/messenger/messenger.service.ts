import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { GetWebhookQueryDTO } from '@shared/models/dtos';
import { MESSAGE_PATTERN } from '@shared/utils';
import { AccessTraderService } from '../access-trader/access-trader.service';
import { config } from '../config/configuration';

@Injectable()
export class MessengerService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-gateway.${AccessTraderService.name}`);
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        // url: process.env.REDIS_URL,
        host: config.redis.host,
        port: config.redis.port, 
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }

  async ping() {
    this.logger.log(`${this.ping.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.MESSENGER }, {}));
  }

  async getWebhook(query: GetWebhookQueryDTO) {
    this.logger.log(`${this.getWebhook.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.GET_WEBHOOK }, query));
  }

  async postWebHook(data: any) {
    this.logger.log(`${this.postWebHook.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.POST_WEBHOOK }, data));
  }
}
