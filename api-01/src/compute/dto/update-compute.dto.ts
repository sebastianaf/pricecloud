import { PartialType } from '@nestjs/swagger';
import { CreateComputeDto } from './create-compute.dto';

export class UpdateComputeDto extends PartialType(CreateComputeDto) {}
