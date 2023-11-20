import { Role } from '../../auth/entities/role.entity';
import { RoleInterface } from '../../auth/interfaces/role.interface';
import { User } from '../entities/user.entity';

export const userData: Partial<User>[] = [
  {
    id: undefined,
    email: 'admin@pricecloud.org',
    firstName: 'Admin',
    secondName: undefined,
    firstLastName: 'Pricecloud',
    secondLastName: 'User',
    password: 'Teardrop7777',
    loginCount: 0,
    role: { id: RoleInterface.admin } as Role,
    company: `Pricecloud`,
    isEmailVerified: true,
    createdAt: undefined,
    updatedAt: undefined,
    active: true,
    country: 'CO',
    timezone: 'America/Bogota',
    credentials: {
      aws: {
        accessId: null,
        secretKey: null,
      },
    },
  },
];
