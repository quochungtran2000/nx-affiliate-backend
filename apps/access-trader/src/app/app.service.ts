import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateMerchantDTO } from '@shared/models/dtos';

import { MerchantRepository } from './repository/merchant-repository';
import { AccessTraderService } from './services/access-trader-service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(`Micro-AccessTrader.${AppService.name}`);
  constructor(
    private readonly accessTraderService: AccessTraderService,
    private readonly merchantRepository: MerchantRepository
  ) {}

  getData(): { message: string } {
    this.logger.log(`${this.getData.name} called`);
    return { message: 'Welcome to access-trader service!' };
  }

  syncCoupons() {
    try {
      this.logger.log(`${this.syncCoupons.name} get coupons from access-trader`);
      return this.accessTraderService.getMerchants();
    } catch (error) {
      this.logger.error(`${this.syncCoupons.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async syncMerchants() {
    try {
      this.logger.log(`${this.syncMerchants.name} sync merchants from access-trader`);
      const { data: merchant } = await this.accessTraderService.syncMerchants();

      await this.merchantRepository.createOrUpdateMany(merchant);

      return merchant;
    } catch (error) {
      this.logger.error(`${this.syncMerchants.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }

  syncKeywords(accessToken: string) {
    try {
      this.logger.log(`${this.syncKeywords.name} sync keywords from access-trader`);
      return this.accessTraderService.syncKeywords(accessToken);
    } catch (error) {
      this.logger.error(`${this.syncKeywords.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async getMerchants() {
    try {
      this.logger.log(`${this.getMerchants.name} called`);
      const data = await this.merchantRepository.getMerchants();
      return data;
    } catch (error) {
      this.logger.error(`${this.getMerchants.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }
}
