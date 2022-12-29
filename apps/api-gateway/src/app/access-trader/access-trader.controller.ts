import { Controller, Get, Post, Body, Logger, Res, HttpException } from '@nestjs/common';
import { AccessTraderService } from './access-trader.service';

import { AccessTraderToken } from '@shared/models/dtos';
import { Response } from 'express';

@Controller('access-trader')
export class AccessTraderController {
  private readonly logger = new Logger(`API-gateway.${AccessTraderController.name}`);
  constructor(private readonly accessTraderService: AccessTraderService) {}

  @Post('sync-coupons')
  async syncCoupon(@Res() res: Response) {
    try {
      this.logger.log(`${this.syncCoupon.name} called`);
      const response = await this.accessTraderService.syncCoupons();
      return res.status(200).json(response);
    } catch (error) {
      this.logger.error(`${this.syncCoupon.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('sync-merchants')
  // async syncMerchants(@Res() res: Response, @Body() data: AccessTraderToken) {
  async syncMerchants(@Res() res: Response) {
    try {
      this.logger.log(`${this.syncMerchants.name} called`);
      // const response = await this.accessTraderService.syncMerchants(AccessTraderToken.from(data));
      const response = await this.accessTraderService.syncMerchants(AccessTraderToken.from({ accessToken: '' }));
      return res.status(200).json(response);
    } catch (error) {
      this.logger.error(`${this.syncMerchants.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('sync-keywords')
  async syncKeywords(@Res() res: Response, @Body() data: AccessTraderToken) {
    try {
      this.logger.log(`${this.syncKeywords.name} called`);
      const response = await this.accessTraderService.syncKeywords(AccessTraderToken.from(data));
      return res.status(200).json(response);
    } catch (error) {
      this.logger.error(`${this.syncKeywords.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('merchant')
  async getMerchants(@Res() res: Response) {
    try {
      this.logger.log(`${this.getMerchants.name} called`);
      const response = await this.accessTraderService.getMerchants();
      return res.status(200).json(response);
    } catch (error) {
      this.logger.error(`${this.syncKeywords.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
