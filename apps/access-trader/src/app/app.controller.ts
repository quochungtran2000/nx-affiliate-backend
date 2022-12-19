import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
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
}
