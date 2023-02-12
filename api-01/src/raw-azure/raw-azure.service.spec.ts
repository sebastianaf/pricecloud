import { Test, TestingModule } from '@nestjs/testing';
import { RawAzureService } from './raw-azure.service';

describe('RawAzureService', () => {
  let service: RawAzureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawAzureService],
    }).compile();

    service = module.get<RawAzureService>(RawAzureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
