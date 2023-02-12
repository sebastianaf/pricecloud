import { Test, TestingModule } from '@nestjs/testing';
import { CloudProviderController } from './cloud-provider.controller';
import { CloudProviderService } from './cloud-provider.service';

describe('CloudProviderController', () => {
  let controller: CloudProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudProviderController],
      providers: [CloudProviderService],
    }).compile();

    controller = module.get<CloudProviderController>(CloudProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
