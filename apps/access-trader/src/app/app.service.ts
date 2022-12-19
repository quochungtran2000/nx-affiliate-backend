import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(`Micro-AccessTrader.${AppService.name}`);

  getData(): { message: string } {
    this.logger.log(`${this.getData.name} called`);
    return { message: 'Welcome to access-trader service!' };
  }
}
