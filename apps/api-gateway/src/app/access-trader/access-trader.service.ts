import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateAccessTraderDto, UpdateAccessTraderDto } from '@shared/models/dtos';
import { MESSAGE_PATTERN } from '@shared/utils';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccessTraderService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`${AccessTraderService.name}`);
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        // url: process.env.REDIS_URL,
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: +(process.env.REDIS_PORT + '') || 6379,
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }

  async ping() {
    this.logger.log(`${this.ping.name} called`);
    return await firstValueFrom(this.client.send({ cmd: MESSAGE_PATTERN.ACCESS_TRADER }, {}));
  }

  create(createAccessTraderDto: CreateAccessTraderDto) {
    return 'This action adds a new accessTrader';
  }

  findAll() {
    return `This action returns all accessTrader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accessTrader`;
  }

  update(id: number, updateAccessTraderDto: UpdateAccessTraderDto) {
    return `This action updates a #${id} accessTrader`;
  }

  remove(id: number) {
    return `This action removes a #${id} accessTrader`;
  }
}
