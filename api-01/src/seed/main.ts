import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed.service';
import { SeedModule } from './seed.module';

async function bootstrap() {
  NestFactory.createApplicationContext(SeedModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(SeedService);
      seeder
        .runSeed()
        .then(() => {
          logger.log('Seed executed successfully', `SeedModule`);
        })
        .catch((error) => {
          logger.error('Seed failed', error.stack, `SeedModule`);
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
