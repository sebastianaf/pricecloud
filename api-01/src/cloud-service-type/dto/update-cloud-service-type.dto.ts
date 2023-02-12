import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudServiceTypeDto } from './create-cloud-service-type.dto';

export class UpdateCloudServiceTypeDto extends PartialType(CreateCloudServiceTypeDto) {}
