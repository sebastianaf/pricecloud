import { createDecipheriv, createCipheriv } from 'crypto';

export const EncryptionTransformer = {
  from(value: string) {
    try {
      const decrypt = createDecipheriv(
        `aes-256-cbc`,
        process.env.DB_SECRET,
        process.env.DB_IV,
        );
        let text = decrypt.update(value, 'base64', 'utf8');
      text += decrypt.final('utf8');
      return text;
    } catch (error) {
      return null;
    }
  },
  to(value: string) {
    try {
      const cipher = createCipheriv(
        `aes-256-cbc`,
        process.env.DB_SECRET,
        process.env.DB_IV,
      );
      let encrypted = cipher.update(value, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      return null;
    }
  },
};
