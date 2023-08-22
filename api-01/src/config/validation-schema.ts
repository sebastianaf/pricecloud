import * as Joi from 'joi';

export default Joi.object({
  API_PORT: Joi.number().min(100).max(65535).required(),
  API_JWT_SECRET: Joi.string().required(),
  API_JWT_EXPIRATION_TIME: Joi.string().min(2).max(3).required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().min(100).max(65535).required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SECRET: Joi.string().length(32).required(),
  DB_IV: Joi.string().length(16).required(),
  ENV: Joi.string().equal(`dev`, `prod`).required(),
  TZ: Joi.string().required(),
});
