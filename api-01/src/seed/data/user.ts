import { User } from '../../user/entities/user.entity';

export const userSeed: User[] = [
  {
    id: undefined,
    email: 'admin@admin.com',
    firstName: 'Admin',
    secondName: undefined,
    firstLastName: 'Pricecloud',
    secondLastName: 'User',
    password: 'pricecloud',
    loginCount: 0,
    createdAt: undefined,
    updatedAt: undefined,
  },
];
