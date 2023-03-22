import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const { firstName, secondName, firstLastName } = createUserDto;
    return `${firstName} ${
      secondName ?? secondName
    } ${firstLastName} ${secondName}`;
  }
}
