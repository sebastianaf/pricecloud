import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Express from 'express';
import * as cookieParser from 'cookie-parser';
import * as moment from 'moment';

import { AppModule } from './app.module';
import { mainDocs } from './docs';
import { ExpressAdapter } from '@nestjs/platform-express';
import { UserModule } from './user/user.module';
import { userDocs } from './user/docs';
import { AuthModule } from './auth/auth.module';
import { authDocs } from './auth/docs';

const server = Express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  moment.locale('es');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: `https://${process.env.API_COOKIE_DOMAIN}`,
    credentials: true,
  });
  app.use(cookieParser());

  const appVersion = process.env.npm_package_version;

  await app.listen(parseInt(process.env.API_PORT) || 5000);
}
bootstrap();
