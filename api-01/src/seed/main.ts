import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed.service';
import { SeedModule } from './seed.module';

async function bootstrap() {
  NestFactory.createApplicationContext(SeedModule)
    .then((appContext) => {
      const seeder = appContext.get(SeedService);
      seeder
        .runSeed()
        .then(() => {
          Logger.log('Seed executed successfully');
        })
        .catch((error) => {
          Logger.error('Seed failed', error.message);
          throw error;
        })
        //.finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
