import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from '@shared/utils';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN.MESSENGER })
  getData() {
    return this.appService.getData();
  }
}
