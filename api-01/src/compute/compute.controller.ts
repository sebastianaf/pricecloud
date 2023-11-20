import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { Protect } from '../auth/decorators/protect.decorator';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { findAllLocationsDto } from './dto/find-all-locations.dto';
import { DeployNodeDto } from './dto/deploy-node.dto';

@Controller('compute')
@ApiTags(`compute`)
export class ComputeController {
  constructor(private readonly computeService: ComputeService) {}

  @Get(`location`)
  @ApiOperation({ summary: `Get all aws locations` })
  @Protect([ViewInterface.deployAws])
  findAllLocations(
    @GetUser() user: User,
    @Query() findAllLocationsDto: findAllLocationsDto,
  ) {
    return this.computeService.findAllLocations(user, findAllLocationsDto);
  }

  @Get(`node`)
  @ApiOperation({ summary: `Get all aws nodes` })
  @Protect([ViewInterface.deployAws])
  findAllnodes(@GetUser() user: User) {
    return this.computeService.findAllNodes(user);
  }

  @Post(`node`)
  @ApiOperation({ summary: `Deploy aws node` })
  @Protect([ViewInterface.deployAws])
  deployNode(@GetUser() user: User, @Body() deployNodeDto: DeployNodeDto) {
    return this.computeService.deployNode(user, deployNodeDto);
  }

  @Get(`image`)
  @ApiOperation({ summary: `Get all aws locations` })
  @Protect([ViewInterface.deployAws])
  findAllImages(@GetUser() user: User) {
    return this.computeService.findAllImages(user);
  }
}
