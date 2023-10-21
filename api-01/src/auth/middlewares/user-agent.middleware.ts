// user-agent.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as useragent from 'express-useragent';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    useragent.express()(req, res, next);
  }
}
