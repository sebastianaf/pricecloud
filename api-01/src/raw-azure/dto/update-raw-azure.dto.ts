import { PartialType } from '@nestjs/mapped-types';
import { CreateRawAzureDto } from './create-raw-azure.dto';

export class UpdateRawAzureDto extends PartialType(CreateRawAzureDto) {}
