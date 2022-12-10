import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTraderModule } from './access-trader/access-trader.module';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [AccessTraderModule, MessengerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
