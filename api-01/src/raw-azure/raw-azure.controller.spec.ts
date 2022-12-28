import { Test, TestingModule } from '@nestjs/testing';
import { RawAzureController } from './raw-azure.controller';
import { RawAzureService } from './raw-azure.service';

describe('RawAzureController', () => {
  let controller: RawAzureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawAzureController],
      providers: [RawAzureService],
    }).compile();

    controller = module.get<RawAzureController>(RawAzureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
