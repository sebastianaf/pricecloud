import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer, ApolloServerOptions, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';
import pinoHttp from 'pino-http';
import path from 'path';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

import { Logger } from 'pino';
import config from './config';
import ApolloLogger from './utils/apolloLogger';
import getResolvers from './resolvers';
import typeDefs from './typeDefs';
import health from './health';
import auth from './auth';
import events from './events';
import stats from './stats';
import home from './home';
import { Product } from './db/types';

export type ApplicationOptions<TContext> = {
  apolloConfigOverrides?: Partial<ApolloServerOptions<BaseContext>>;
  disableRequestLogging?: boolean;
  disableStats?: boolean;
  disableAuth?: boolean;
  logger?: Logger;
  convertProducts?(context: TContext, products: Product[]): Promise<Product[]>;
};

interface ResponseError extends Error {
  status?: number;
}

async function createApp<TContext>(
  opts: ApplicationOptions<TContext> = {}
): Promise<{ httpServer: HttpServer; io: IOServer }> {
  const app = express();
  const httpServer = new HttpServer(app);
  const io = new IOServer(httpServer, { cors: { origin: '*' } });

  const logger = opts.logger || config.logger;

  if (!opts.disableRequestLogging) {
    app.use(
      pinoHttp({
        logger,
        customLogLevel(_req, res, err) {
          if (err || res.statusCode === 500) {
            return 'error';
          }
          return 'info';
        },
        autoLogging: {
          ignore: (req) => req.url === '/health',
        },
      })
    );
  }

  if (!opts.disableStats) {
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(home);
  }

  app.use(express.json());
  app.use(
    (err: ResponseError, _req: Request, res: Response, next: NextFunction) => {
      if (err instanceof SyntaxError && err.status === 400) {
        res.status(400).send({ error: 'Bad request' });
      } else {
        next();
      }
    }
  );

  if (!opts.disableRequestLogging) {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (!['/health', '/graphql'].includes(req.path)) {
        logger.debug({ body: req.body });
      }
      next();
    });
  }

  app.use(health);

  if (!opts.disableAuth) {
    app.use(auth);
  }

  if (!opts.disableStats) {
    app.use(events);
    app.use(stats);
  }

  const apolloConfig = {
    schema: makeExecutableSchema({
      typeDefs,
      resolvers: getResolvers<TContext>(opts),
    }),
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault(),
      new ApolloLogger(logger),
    ],
    ...opts.apolloConfigOverrides,
  };

  const apollo = new ApolloServer<BaseContext>(
    apolloConfig as ApolloServerOptions<BaseContext>
  );

  await apollo.start();

  app.use('/graphql', cors<cors.CorsRequest>(), expressMiddleware(apollo));

  return { httpServer, io };
}

export default createApp;
