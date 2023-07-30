import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  async runSeed() {
    console.log('Seed executed successfully');
  }
}
