/* eslint no-shadow: ["error", { "allow": ["requestContext"] }] */

import prettier from 'prettier';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';
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

export default class ApolloLogger implements ApolloServerPlugin<BaseContext> {
  constructor(private logger: Logger) {}

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>
  ): Promise<GraphQLRequestListener<BaseContext>> {
    const { logger } = this;
    const logProps =
      (requestContext.contextValue as Record<string, unknown>)?.logProps || {};

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
      async didEncounterErrors(requestContext): Promise<void> {
        const errors = truncate(JSON.stringify(requestContext.errors));
        logger.error(logProps, `GraphQL encountered errors:\n${errors}`);
      },
      async willSendResponse(requestContext): Promise<void> {
        const body = requestContext.response.body;
        const respData = truncate(
          body.kind === 'single'
            ? JSON.stringify(body.singleResult.data)
            : '[incremental response]'
        );
        logger.debug(logProps, `GraphQL request completed:\n${respData}`);
      },
    };
  }
}
