import * as Joi from 'joi';

export default Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().min(2).max(3).required(),
  DB_HOST: Joi.string().ip().required(),
  DB_PORT: Joi.number().min(100).max(65535).required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  ENV: Joi.string().equal(`dev`, `prod`).required(),
});
