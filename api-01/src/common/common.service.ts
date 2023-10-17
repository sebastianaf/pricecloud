import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { createDecipheriv, createCipheriv } from 'crypto';

@Injectable()
export class CommonService {
  private readonly secret: string;
  private readonly initializationVector: string;

  constructor() {
    this.secret = process.env.COMMON_SECRET;
    this.initializationVector = process.env.COMMON_IV;
  }

  removeAccents(string: string) {
    return string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async encrypt(value: string, iv?: string) {
    try {
      const cipher = createCipheriv(
        `aes-256-cbc`,
        this.secret,
        iv || this.initializationVector,
      );
      let encrypted = cipher.update(value, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      Logger.error(error.message);
      throw new ConflictException(`Error al encriptar (CE-001)`);
    }
  }

  async decrypt(value: string, iv?: string) {
    try {
      const decrypt = createDecipheriv(
        `aes-256-cbc`,
        this.secret,
        iv || this.initializationVector,
      );
      let text = decrypt.update(value, 'base64', 'utf8');
      text += decrypt.final('utf8');
      return text;
    } catch (error) {
      throw new ConflictException(`Error al desencriptar (CD-001)`);
    }
  }
}
