import { Test, TestingModule } from '@nestjs/testing';
import { CloudServiceService } from './cloud-service.service';

describe('CloudServiceService', () => {
  let service: CloudServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudServiceService],
    }).compile();

    service = module.get<CloudServiceService>(CloudServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
