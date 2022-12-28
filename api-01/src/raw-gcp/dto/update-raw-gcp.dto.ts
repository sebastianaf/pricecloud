import { PartialType } from '@nestjs/mapped-types';
import { CreateRawGcpDto } from './create-raw-gcp.dto';

export class UpdateRawGcpDto extends PartialType(CreateRawGcpDto) {}
