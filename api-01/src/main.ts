import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as Express from 'express';
import * as cookieParser from 'cookie-parser';
import * as moment from 'moment';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { DocsService } from './docs/docs.service';

const server = Express();
server.set(`trust proxy`, 1);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  moment.locale('es');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Dummy commit
  app.enableCors({
    origin: `https://${process.env.API_COOKIE_DOMAIN}`,
    credentials: true,
  });
  app.use(cookieParser());

  const docsService = app.get(DocsService);
  await docsService.createDocs(app);

  await app.listen(parseInt(process.env.API_PORT) || 5000);
}
bootstrap();
