import { PartialType } from '@nestjs/mapped-types';
import { CreateRawAwDto } from './create-raw-aw.dto';

export class UpdateRawAwDto extends PartialType(CreateRawAwDto) {}
