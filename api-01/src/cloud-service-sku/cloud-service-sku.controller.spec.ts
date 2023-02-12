import { Test, TestingModule } from '@nestjs/testing';
import { CloudServiceSkuController } from './cloud-service-sku.controller';
import { CloudServiceSkuService } from './cloud-service-sku.service';

describe('CloudServiceSkuController', () => {
  let controller: CloudServiceSkuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudServiceSkuController],
      providers: [CloudServiceSkuService],
    }).compile();

    controller = module.get<CloudServiceSkuController>(CloudServiceSkuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
