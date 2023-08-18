import { EncryptionTransformer } from './encryption.transformer';

export const EncryptionLowerCaseTransformer = {
  from(value: string) {
    try {
      return EncryptionTransformer.from(value).toLocaleLowerCase();
    } catch (error) {
      return null;
    }
  },
  to(value: string) {
    try {
      return EncryptionTransformer.to(value.toLocaleLowerCase());
    } catch (error) {
      return null;
    }
  },
};
