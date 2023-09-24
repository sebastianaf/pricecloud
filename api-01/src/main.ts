import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import * as Express from 'express';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { mainDocs } from './docs';
import { ExpressAdapter } from '@nestjs/platform-express';
import { UserModule } from './user/user.module';
import { userDocs } from './user/docs';
import { AuthModule } from './auth/auth.module';
import { authDocs } from './auth/docs';

const server = Express();
server.use(cors());

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: `https://local.enerfris.com`,
    credentials: true,
  });
  app.use(cookieParser());

  const appVersion = process.env.npm_package_version;

  if (process.env.ENV !== 'prod') {
    SwaggerModule.setup(
      'docs',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('pricecloud-api-01')
          .setDescription(`${mainDocs}`)
          .setVersion(appVersion)
          .build(),
        { include: [null] },
      ),
    );

    SwaggerModule.setup(
      'docs/user',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('user')
          .setDescription(`${userDocs}`)
          .setVersion('1.0.0')
          .addBearerAuth({
            type: `http`,
            scheme: `bearer`,
            bearerFormat: `JWT`,
            description: `JWT Token`,
          })
          .addServer('http://localhost:5000', `Local server`)
          .addServer('https://api.dev.pricecloud.org', `Development server`)
          .addServer('https://api.pricecloud.org', `Production server`)
          .build(),
        { include: [UserModule] },
      ),
    );

    SwaggerModule.setup(
      'docs/auth',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('auth')
          .setDescription(`${authDocs}`)
          .setVersion('1.0.0')
          .addBearerAuth({
            type: `http`,
            scheme: `bearer`,
            bearerFormat: `JWT`,
            description: `JWT Token`,
          })
          .addServer('http://localhost:5000', `Local server`)
          .addServer('https://api.dev.pricecloud.org', `Development server`)
          .addServer('https://api.pricecloud.org', `Production server`)
          .build(),
        { include: [AuthModule] },
      ),
    );
  }

  await app.listen(parseInt(process.env.API_PORT) || 5000);
}
bootstrap();
