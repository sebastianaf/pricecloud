import { User } from '../../user/entities/user.entity';

export const userSeed: Partial<User>[] = [
  {
    id: undefined,
    email: 'admin@pricecloud.org',
    firstName: 'Admin',
    secondName: undefined,
    firstLastName: 'Pricecloud',
    secondLastName: 'User',
    password: 'Teardrop7777',
    loginCount: 0,
    company: `Pricecloud`,
    createdAt: undefined,
    updatedAt: undefined,
  },
];
