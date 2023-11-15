import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import axios from 'axios';

@Injectable()
export class ComputeService {
  constructor() {}

  async findAllLocations(user: User) {
    try {
      const request = {
        access_id: 'AKIAYVY2JPWUTMCZIN5I',
        secret_key: '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',
      };

      const response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}/compute/locations`,
        request,
      );

      console.log(response.data);

      return { message: `Recived from compute service` };
    } catch (error) {
      console.log(error);
      return { message: `Error from compute service` };
    }
  }
}
