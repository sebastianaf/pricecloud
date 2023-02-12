import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudServiceSkuDto } from './create-cloud-service-sku.dto';

export class UpdateCloudServiceSkuDto extends PartialType(CreateCloudServiceSkuDto) {}
