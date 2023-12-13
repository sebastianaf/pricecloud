import * as Joi from 'joi';
import { EnvironmentInterface } from './interfaces/environment.interface';

export default Joi.object({
  API_PORT: Joi.number().min(100).max(65535).required(),
  API_JWT_SECRET: Joi.string().required(),
  API_JWT_EXPIRATION_TIME: Joi.string().min(2).max(3).required(),
  API_COOKIE_EXPIRATION_TIME: Joi.number()
    .min(1000 * 5) //30 seconds
    .max(1000 * 60 * 30 * 1) //1 hour
    .required(),
  API_COOKIE_DOMAIN: Joi.string().required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().min(100).max(65535).required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SECRET: Joi.string().length(32).required(),
  DB_IV: Joi.string().length(16).required(),
  ENV: Joi.string()
    .equal(
      EnvironmentInterface.local,
      EnvironmentInterface.development,
      EnvironmentInterface.production,
    )
    .required(),
  TZ: Joi.string().required(),
  EMAIL_HOST: Joi.string().hostname().required(),
  EMAIL_PORT: Joi.number().min(100).max(65535).required(),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASSWORD: Joi.string().required().min(8).max(32),
  COMMON_SECRET: Joi.string().length(32).required(),
  COMMON_IV: Joi.string().length(16).required(),
  API02_HOST: Joi.string().hostname().required(),
  API02_PORT: Joi.number().min(100).max(65535).required(),
  API03_HOST: Joi.string().hostname().required(),
  API03_PORT: Joi.number().min(100).max(65535).required(),
});
