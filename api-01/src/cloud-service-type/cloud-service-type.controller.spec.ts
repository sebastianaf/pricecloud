import { Test, TestingModule } from '@nestjs/testing';
import { CloudServiceTypeController } from './cloud-service-type.controller';
import { CloudServiceTypeService } from './cloud-service-type.service';

describe('CloudServiceTypeController', () => {
  let controller: CloudServiceTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudServiceTypeController],
      providers: [CloudServiceTypeService],
    }).compile();

    controller = module.get<CloudServiceTypeController>(CloudServiceTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
