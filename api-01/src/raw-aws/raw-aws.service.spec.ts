import { Test, TestingModule } from '@nestjs/testing';
import { RawAwsService } from './raw-aws.service';

describe('RawAwsService', () => {
  let service: RawAwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawAwsService],
    }).compile();

    service = module.get<RawAwsService>(RawAwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
