import { Test, TestingModule } from '@nestjs/testing';
import { RawGcpService } from './raw-gcp.service';

describe('RawGcpService', () => {
  let service: RawGcpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawGcpService],
    }).compile();

    service = module.get<RawGcpService>(RawGcpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
