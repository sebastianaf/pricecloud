import { NextFunction, Request, Response } from 'express';
import config from './config';

async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKey = req.headers['x-api-key'];

  if (
    config.selfHostedInfracostAPIKey &&
    config.selfHostedInfracostAPIKey !== apiKey
  ) {
    res.status(403).json({ error: 'Invalid API key' });
    return;
  }
  next();
}

export default auth;
