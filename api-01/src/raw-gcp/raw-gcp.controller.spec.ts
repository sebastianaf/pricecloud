import { Test, TestingModule } from '@nestjs/testing';
import { RawGcpController } from './raw-gcp.controller';
import { RawGcpService } from './raw-gcp.service';

describe('RawGcpController', () => {
  let controller: RawGcpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawGcpController],
      providers: [RawGcpService],
    }).compile();

    controller = module.get<RawGcpController>(RawGcpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
