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
          logger.debug('Seed executed successfully');
        })
        .catch((error) => {
          logger.error('Seed failed');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
