import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComputeService } from './compute.service';
import { CreateComputeDto } from './dto/create-compute.dto';
import { UpdateComputeDto } from './dto/update-compute.dto';

@Controller('compute')
export class ComputeController {
  constructor(private readonly computeService: ComputeService) {}
}
