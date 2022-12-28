import { Test, TestingModule } from '@nestjs/testing';
import { CloudServiceController } from './cloud-service.controller';
import { CloudServiceService } from './cloud-service.service';

describe('CloudServiceController', () => {
  let controller: CloudServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudServiceController],
      providers: [CloudServiceService],
    }).compile();

    controller = module.get<CloudServiceController>(CloudServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
