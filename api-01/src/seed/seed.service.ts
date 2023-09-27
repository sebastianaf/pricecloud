import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { roleSeed, roleViewSeed, userSeed, viewSeed } from './seed.data';
import { View } from '../auth/entities/view.entity';
import { Role } from '../auth/entities/role.entity';
import { RoleView } from '../auth/entities/role-view.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleView)
    private readonly roleViewRepository: Repository<RoleView>,
  ) {}

  async runSeed() {
    await this.seedUser();
    await this.seed(`View`, viewSeed, this.viewRepository);
    await this.seed(`Role`, roleSeed, this.roleRepository);
    await this.seedRoleView();
  }

  async seed(name: string, data: any[], repository: Repository<any>) {
    this.logger.debug(`${name} seeding`, `SeedModule`);
    for (let i = 0; i < data.length; i++) {
      const item = await repository.findOne({ where: { id: data[i].id } });
      if (item) {
        this.logger.log(
          `${name} with id "${data[i].id}" already created`,
          `SeedModule`,
        );
      } else {
        await repository.save({ ...data[i] });
        this.logger.verbose(
          `${name} with id "${data[i].id}" created`,
          `SeedModule`,
        );
      }
    }
  }

  async seedUser() {
    this.logger.debug(`User seeding`, `SeedModule`);
    for (let i = 0; i < userSeed.length; i++) {
      const user = await this.userRepository.findOne({
        where: { email: userSeed[0].email },
      });
      if (user) {
        this.logger.log(
          `User "${userSeed[0].email}" already created`,
          `SeedModule`,
        );
      } else {
        userSeed[i].password = bcrypt.hashSync(userSeed[i].password, 10);
        await this.userRepository.save(userSeed[i]);
        this.logger.verbose(
          `User "${userSeed[0].email}" created`,
          `SeedModule`,
        );
      }
    }
  }

  async seedRoleView() {
    this.logger.debug(`RoleView seeding`, `SeedModule`);
    for (let i = 0; i < roleViewSeed.length; i++) {
      const item = await this.roleViewRepository.findOne({
        where: { role: roleViewSeed[i].role, view: roleViewSeed[i].view },
      });
      const debugField = `"{${roleViewSeed[i].role.id},${roleViewSeed[i].view.id}}"`;
      if (item) {
        this.logger.log(`RoleView ${debugField} already created`, `SeedModule`);
      } else {
        await this.roleViewRepository.save(roleViewSeed[i]);
        this.logger.verbose(`RoleView ${debugField} created`, `SeedModule`);
      }
    }
  }
}
