import { Test, TestingModule } from '@nestjs/testing';
import { AccessTraderController } from './access-trader.controller';
import { AccessTraderService } from './access-trader.service';

describe('AccessTraderController', () => {
  let controller: AccessTraderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessTraderController],
      providers: [AccessTraderService],
    }).compile();

    controller = module.get<AccessTraderController>(AccessTraderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
