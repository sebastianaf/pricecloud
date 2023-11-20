import { AuthModule } from '../../auth/auth.module';
import { ComputeModule } from '../../compute/compute.module';
import { StorageModule } from '../../storage/storage.module';
import { UserModule } from '../../user/user.module';
import { DocsInterface } from '../interfaces/docs.interface';

export const docsData: DocsInterface[] = [
  { module: UserModule, name: 'user', version: '1.0.0' },
  { module: AuthModule, name: 'auth', version: '1.0.0' },
  { module: ComputeModule, name: 'compute', version: '1.0.0' },
  { module: StorageModule, name: 'storage', version: '1.0.0' },
];
