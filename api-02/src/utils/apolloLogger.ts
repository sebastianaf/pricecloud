/* eslint no-shadow: ["error", { "allow": ["requestContext"] }] */

import prettier from 'prettier';
import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { Logger } from 'pino';

const DEFAULT_TRUNCATE_LENGTH = 4096;

function truncate(str: string, l = DEFAULT_TRUNCATE_LENGTH): string {
  if (str == null) {
    return '';
  }

  if (str.length <= l) {
    return str;
  }
  return `${str.slice(0, l)}...`;
}

export default class ApolloLogger implements ApolloServerPlugin {
  constructor(private logger: Logger) {}

  async requestDidStart(
    requestContext: GraphQLRequestContext
  ): Promise<GraphQLRequestListener> {
    const { logger } = this;
    const logProps = requestContext.context.logProps || {};

    if (requestContext.request.query?.startsWith('query IntrospectionQuery')) {
      return {};
    }

    let q = '';
    try {
      q = prettier.format(requestContext.request.query || '', {
        parser: 'graphql',
      });
    } catch (e) {
      const el = truncate(requestContext.request.query || '');
      logger.debug(`invalid query provided: ${el}`);
    }

    const query = truncate(q);
    const vars = truncate(
      JSON.stringify(requestContext.request.variables || {}, null, 2)
    );
    logger.debug(
      logProps,
      `GraphQL request started:\n${query}\nvariables:\n${vars}`
    );

    return {
      async didEncounterErrors(
        requestContext: GraphQLRequestContext
      ): Promise<void> {
        const errors = truncate(JSON.stringify(requestContext.errors));
        logger.error(logProps, `GraphQL encountered errors:\n${errors}`);
      },
      async willSendResponse(
        requestContext: GraphQLRequestContext
      ): Promise<void> {
        const respData = truncate(
          JSON.stringify(requestContext.response?.data)
        );
        logger.debug(logProps, `GraphQL request completed:\n${respData}`);
      },
    };
  }
}
