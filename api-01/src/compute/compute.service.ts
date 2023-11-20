import { Injectable, ConflictException, Logger } from '@nestjs/common';
import axios from 'axios';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { VendorInterface } from './interfaces/vendor.interface';
import { LogService } from '../log/log.service';
import { LogTypeInterface } from '../log/interfaces/log-type.interface';
import { findAllLocationsDto } from './dto/find-all-locations.dto';
import paths from '../common/paths';
import { DeployNodeDto } from './dto/deploy-node.dto';

@Injectable()
export class ComputeService {
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

  async findAllLocations(user: User, findAllLocationsDto: findAllLocationsDto) {
    const credentials = await this.validateFindAllLocations(user);

    const request = {
      access_id: credentials.aws.accessId,
      secret_key: credentials.aws.secretKey,
    };

    let response: { data: Object };
    try {
      response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}${paths.api03.compute.locations}`,
        request,
      );
    } catch (error) {
      Logger.error(error?.response?.data.error);
      throw new ConflictException(error?.response?.data.error);
    }
    return response.data;
  }

  async findAllNodes(user: User) {
    const credentials = await this.validateFindAllLocations(user);

    const request = {
      access_id: credentials.aws.accessId,
      secret_key: credentials.aws.secretKey,
    };

    let response: { data: Object };
    try {
      response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}${paths.api03.compute.nodes}`,
        request,
      );
    } catch (error) {
      Logger.error(error?.response?.data.error);
      throw new ConflictException(error?.response?.data.error);
    }

    return response.data;
  }

  async findAllImages(user: User) {
    const credentials = await this.validateFindAllLocations(user);

    const request = {
      access_id: credentials.aws.accessId,
      secret_key: credentials.aws.secretKey,
    };

    let response: { data: Object };
    try {
      response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}${paths.api03.compute.images}`,
        request,
      );
    } catch (error) {
      Logger.error(error?.response?.data.error);
      throw new ConflictException(error?.response?.data.error);
    }
    return response.data;
  }

  async deployNode(user: User, deployNodeDto: DeployNodeDto) {
    const credentials = await this.validateFindAllLocations(user);

    const { imageId, nodeName, sizeId } = deployNodeDto;

    const request = {
      access_id: credentials.aws.accessId,
      secret_key: credentials.aws.secretKey,
      image_id: imageId,
      node_name: nodeName,
      size_id: sizeId,
    };

    let response: { data: Object };
    try {
      response = await axios.post(
        `http://${process.env.API03_HOST}:${process.env.API03_PORT}${paths.api03.compute.deploy}`,
        request,
      );
    } catch (error) {
      Logger.error(error?.response?.data.error);
      throw new ConflictException(error?.response?.data.error);
    }

    return {
      title: `¡Instancia desplegada!`,
      message: `Tu nodo "${nodeName}" ha sido desplegada`,
    };
  }
}
