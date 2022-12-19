import { Body, Controller, Get, Logger, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetWebhookQueryDTO } from '@shared/models/dtos';
import { MESSAGE_PATTERN } from '@shared/utils';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(`Micro-Messenger.${AppController.name}`);
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN.MESSENGER })
  getData() {
    return this.appService.getData();
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN.GET_WEBHOOK })
  getWebhook(@Body() data: GetWebhookQueryDTO) {
    this.logger.log(`${this.getWebhook.name} called with :${JSON.stringify(data)}`);
    return this.appService.getWebhook(data);
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN.POST_WEBHOOK })
  postWebhook(@Body() data: any) {
    this.logger.log(`${this.postWebhook.name} called with :${JSON.stringify(data)}`);
    return this.appService.postWebhook(data);
  }

}
