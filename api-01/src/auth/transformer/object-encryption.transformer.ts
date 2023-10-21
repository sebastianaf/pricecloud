import { EncryptionTransformer } from './encryption.transformer';

export const ObjectEncryptionTransformer = {
  from(value: string) {
    try {
      const jsonString = EncryptionTransformer.from(value);
      const json = JSON.parse(jsonString);
      return json;
    } catch (error) {
      return null;
    }
  },
  to(value: string) {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = EncryptionTransformer.to(jsonString);
      return encrypted;
    } catch (error) {
      return null;
    }
  },
};
