import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudProviderDto } from './create-cloud-provider.dto';

export class UpdateCloudProviderDto extends PartialType(CreateCloudProviderDto) {}
