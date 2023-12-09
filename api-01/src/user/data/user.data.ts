import { Role } from '../../auth/entities/role.entity';
import { RoleInterface } from '../../auth/interfaces/role.interface';
import { User } from '../entities/user.entity';

export const userData: Partial<User>[] = [
  {
    id: `e0b6f07c-5329-4f21-b893-e3fb83a5da9a`,
    email: 'admin@pricecloud.org',
    firstName: 'Admin',
    firstLastName: 'Pricecloud',
    secondLastName: 'User',
    password: 'Teardrop7777',
    loginCount: 0,
    role: { id: RoleInterface.admin } as Role,
    company: `Pricecloud`,
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
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
