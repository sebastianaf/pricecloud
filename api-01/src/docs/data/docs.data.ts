import { AuthModule } from '../../auth/auth.module';
import { CommonModule } from '../../common/common.module';
import { ComputeModule } from '../../compute/compute.module';
import { EmailModule } from '../../email/email.module';
import { LogModule } from '../../log/log.module';
import { PriceModule } from '../../price/price.module';
import { SeedModule } from '../../seed/seed.module';
import { StorageModule } from '../../storage/storage.module';
import { UserModule } from '../../user/user.module';
import { DocsInterface } from '../interfaces/docs.interface';

export const docsData: DocsInterface[] = [
  { module: UserModule, name: 'user', version: '1.0.0' },
  { module: AuthModule, name: 'auth', version: '1.0.0' },
  { module: ComputeModule, name: 'compute', version: '1.0.0' },
  { module: StorageModule, name: 'storage', version: '1.0.0' },
  { module: PriceModule, name: 'price', version: '1.0.0' },
  { module: SeedModule, name: 'seed', version: '1.0.0' },
  { module: CommonModule, name: 'common', version: '1.0.0' },
  { module: EmailModule, name: 'email', version: '1.0.0' },
  { module: LogModule, name: 'log', version: '1.0.0' },
];
