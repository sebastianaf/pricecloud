import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
    },
    jwtExpiration: process.env.JWT_EXPIRATION_TIME,
    jwtSecret: process.env.JWT_SECRET,
  };
});
