import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccessTraderToken } from '@shared/models/dtos';
import { MESSAGE_PATTERN } from '@shared/utils';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(`Micro-AccessTrader.${AppController.name}`);
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN.ACCESS_TRADER })
  getData() {
    this.logger.log(`${this.getData.name} call`);
    return this.appService.getData();
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN.SYNC_COUPONS })
  syncCoupons() {
    this.logger.log(`${this.syncCoupons.name} called`);
    return this.appService.syncCoupons();
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN.SYNC_MERCHANTS })
  syncMerchants() {
    this.logger.log(`${this.syncMerchants.name} called`);
    return this.appService.syncMerchants();
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN.SYNC_KEYWORDS })
  syncKeywords({ accessToken }: AccessTraderToken) {
    this.logger.log(`${this.syncKeywords.name} called`);
    return this.appService.syncKeywords(accessToken);
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN.GET_MERCHANTS })
  getMerchants() {
    this.logger.log(`${this.getMerchants.name} called`);
    return this.appService.getMerchants();
  }
}
