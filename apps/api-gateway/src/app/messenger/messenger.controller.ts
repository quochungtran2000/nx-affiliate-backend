import { Controller, Get, Logger, Res, Query, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { Response } from 'express';

import { GetWebhookQueryDTO } from '@shared/models/dtos';
import { MessengerService } from './messenger.service';

@Controller('messenger')
export class MessengerController {
  private readonly logger = new Logger(`API-gateway.${MessengerController.name}`);
  constructor(private readonly messengerService: MessengerService) {}

  @Get()
  ping(@Res() res: Response) {
    try {
      this.logger.log(`${this.ping.name} called`);
      const response = this.messengerService.ping();
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      this.logger.error(`${this.ping.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('webhook')
  async getWebHook(@Res() res: Response, @Query() query: GetWebhookQueryDTO) {
    try {
      this.logger.log(`${this.getWebHook.name} called`);
      const { code, message} = await this.messengerService.getWebhook(query);
      return res.status(code).json(message);
    } catch (error) {
      this.logger.error(`${this.getWebHook.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('webhook')
  async postWebHook(@Res() res: Response, @Body() data: any) {
    try {
      this.logger.log(`${this.postWebHook.name} called`);
      const response = await this.messengerService.postWebHook(data);
      
      return res.status(response.code).send(response.message);
    } catch (error) {
      this.logger.error(`${this.postWebHook.name}: ${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
