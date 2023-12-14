import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { User } from '../user/entities/user.entity';
import axios from 'axios';
import { VendorInterface } from '../compute/interfaces/vendor.interface';
import { UserService } from '../user/user.service';
import { LogService } from '../log/log.service';
import { LogTypeInterface } from '../log/interfaces/log-type.interface';
import paths from '../common/paths';

@Injectable()
export class StorageService {
  constructor(
    private readonly userService: UserService,
    private readonly logService: LogService,
  ) {}

  async validateFindAllLocations(user: User) {
    const isCredentials = await this.userService.checkCredentials(
      user,
      VendorInterface.aws,
    );
    if (!isCredentials) {
      const message = `Por favor configura tus credenciales de AWS`;
      await this.logService.create({
        logType: LogTypeInterface.error,
        message,
        user,
      });
      throw new ConflictException(message);
    }

    const credentials = await this.userService.findOneCredentials(user);
    return credentials;
  }

  async createBucket(user: User, createStorageDto: CreateStorageDto) {
    const credentials = await this.validateFindAllLocations(user);

    const { bucketName } = createStorageDto;

    const request = {
      access_id: credentials.aws.accessId,
      secret_key: credentials.aws.secretKey,
      bucket_name: bucketName,
    };

    let response: { data: Object };
    try {
      response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}${paths.api03.storage.create}`,
        request,
      );
    } catch (error) {
      Logger.error(error?.response?.data.error);
      throw new ConflictException(error?.response?.data.error);
    }

    return {
      title: `¡Exito!`,
      message: `Tu bucket "${bucketName}" ha sido creado exitosamente`,
    };
  }

  async findAllContainers(user: User) {
    const credentials = await this.validateFindAllLocations(user);

    const request = {
      access_id: credentials.aws.accessId,
      secret_key: credentials.aws.secretKey,
    };

    let response: { data: Object };
    try {
      response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}${paths.api03.storage.buckets}`,
        request,
      );
    } catch (error) {
      Logger.error(error?.response?.data.error);
      throw new ConflictException(error?.response?.data.error);
    }

    return response.data;
  }
}
