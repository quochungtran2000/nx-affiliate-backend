import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GetMerchantResponse } from '@shared/models/dtos';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { config } from '../config/configuration';

@Injectable()
export class AccessTraderService {
  private readonly logger = new Logger(`Micro-AccessTrader.${AccessTraderService.name}`);
  private readonly accessTraderApi = 'https://api.accesstrade.vn/v1';
  private readonly pubAccessTraderApi = 'https://pub2-api.accesstrade.vn/v1';
  private readonly headers = {
    Authorization: `Token ${config.accessTrader.apiKey}`,
    'Content-Type': 'application/json',
  };
  private readonly headersOrigin = {
    origin: 'https://pub2.accesstrade.vn',
    referer: 'https://pub2.accesstrade.vn/',
  };
  constructor(private readonly httpService: HttpService) {}

  async getMerchants() {
    try {
      this.logger.log(`${this.getMerchants.name} called`);
      const url = `${this.accessTraderApi}/offers_informations/merchant_list`;

      const { data: merchants } = await firstValueFrom(this.httpService.get(url, { headers: { ...this.headers } }));

      return merchants;
    } catch (error) {
      this.logger.error(`${this.getMerchants.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async syncMerchants() {
    try {
      this.logger.log(`${this.syncMerchants.name} called`);

      const url = `${this.accessTraderApi}/offers_informations/merchant_list`;
      const queryOptions = { headers: { ...this.headers } };

      const { data: merchantsData } = await lastValueFrom(
        this.httpService.get<{ data: GetMerchantResponse[] }>(url, queryOptions)
      );

      return merchantsData;
    } catch (error) {
      this.logger.error(`${this.syncMerchants.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async syncKeywords(accessToken: string) {
    try {
      this.logger.log(`${this.syncKeywords.name} called`);
      const url = `${this.pubAccessTraderApi}/creative/keyword_list`;

      const { data: keywordResponse } = await firstValueFrom(
        this.httpService.get(url, {
          headers: { ...this.headers, ...this.headersOrigin, authorization: `Bearer ${accessToken}` },
        })
      );

      if (!keywordResponse.success) throw new InternalServerErrorException('Sync keywords from AccessTrader Error');

      return keywordResponse.data;
    } catch (error) {
      this.logger.error(`${this.syncKeywords.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }
}
