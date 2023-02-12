import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudServiceDto } from './create-cloud-service.dto';

export class UpdateCloudServiceDto extends PartialType(CreateCloudServiceDto) {}
