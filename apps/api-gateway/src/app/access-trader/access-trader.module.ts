import { Module } from '@nestjs/common';
import { AccessTraderService } from './access-trader.service';
import { AccessTraderController } from './access-trader.controller';

@Module({
  controllers: [AccessTraderController],
  providers: [AccessTraderService],
})
export class AccessTraderModule {}
