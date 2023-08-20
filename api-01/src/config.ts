import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    jwtExpiration: process.env.API_JWT_EXPIRATION_TIME,
    jwtSecret: process.env.API_JWT_SECRET,
  };
});
