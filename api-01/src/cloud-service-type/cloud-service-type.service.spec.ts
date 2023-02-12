import { Test, TestingModule } from '@nestjs/testing';
import { CloudServiceTypeService } from './cloud-service-type.service';

describe('CloudServiceTypeService', () => {
  let service: CloudServiceTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudServiceTypeService],
    }).compile();

    service = module.get<CloudServiceTypeService>(CloudServiceTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
