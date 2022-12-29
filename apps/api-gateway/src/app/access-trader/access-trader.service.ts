import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { AccessTraderToken } from '@shared/models/dtos';
import { MESSAGE_PATTERN } from '@shared/utils';
import { config } from '../config/configuration';

@Injectable()
export class AccessTraderService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-gateway.${AccessTraderService.name}`);
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: config.redis.host,
        port: config.redis.port,
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }

  async ping() {
    this.logger.log(`${this.ping.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.ACCESS_TRADER }, {}));
  }

  async syncCoupons() {
    this.logger.log(`${this.syncCoupons.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.SYNC_COUPONS }, {}));
  }

  async syncKeywords(data: AccessTraderToken) {
    this.logger.log(`${this.syncKeywords.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.SYNC_KEYWORDS }, data));
  }

  async syncMerchants(data: AccessTraderToken) {
    this.logger.log(`${this.syncMerchants.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.SYNC_MERCHANTS }, data));
  }

  async getMerchants() {
    this.logger.log(`${this.getMerchants.name} called`);
    return await lastValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.GET_MERCHANTS }, {}));
  }
}
