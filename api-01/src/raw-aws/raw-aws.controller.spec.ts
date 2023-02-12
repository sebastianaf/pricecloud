import { Test, TestingModule } from '@nestjs/testing';
import { RawAwsController } from './raw-aws.controller';
import { RawAwsService } from './raw-aws.service';

describe('RawAwsController', () => {
  let controller: RawAwsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawAwsController],
      providers: [RawAwsService],
    }).compile();

    controller = module.get<RawAwsController>(RawAwsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
