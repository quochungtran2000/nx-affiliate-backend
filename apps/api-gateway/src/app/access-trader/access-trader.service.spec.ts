import { Test, TestingModule } from '@nestjs/testing';
import { AccessTraderService } from './access-trader.service';

describe('AccessTraderService', () => {
  let service: AccessTraderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessTraderService],
    }).compile();

    service = module.get<AccessTraderService>(AccessTraderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
