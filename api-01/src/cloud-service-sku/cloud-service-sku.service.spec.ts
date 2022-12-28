import { Test, TestingModule } from '@nestjs/testing';
import { CloudServiceSkuService } from './cloud-service-sku.service';

describe('CloudServiceSkuService', () => {
  let service: CloudServiceSkuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudServiceSkuService],
    }).compile();

    service = module.get<CloudServiceSkuService>(CloudServiceSkuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
