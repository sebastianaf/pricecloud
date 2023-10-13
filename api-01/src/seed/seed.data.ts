import { RoleView } from '../auth/entities/role-view.entity';
import { Role } from '../auth/entities/role.entity';
import { View } from '../auth/entities/view.entity';
import { RoleInterface } from '../auth/interfaces/role.interface';
import { ViewInterface } from '../auth/interfaces/view.interface';
import { User } from '../user/entities/user.entity';

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
    role: { id: RoleInterface.admin } as any,
    company: `Pricecloud`,
    isEmailVerified: true,
    createdAt: undefined,
    updatedAt: undefined,
  },
];

export const viewSeed: Partial<View>[] = [
  {
    id: ViewInterface.dashboard,
    label: 'Dashboard',
  },
  {
    id: ViewInterface.userConfig,
    label: 'Configuración de usuario',
  },
];

export const roleSeed: Partial<Role>[] = [
  {
    id: RoleInterface.admin,
    label: 'Admin',
  },
  {
    id: RoleInterface.user,
    label: 'User',
  },
];

export const roleViewSeed: Partial<RoleView>[] = [
  {
    role: { id: RoleInterface.admin } as any,
    view: { id: ViewInterface.dashboard } as any,
  },
  {
    role: { id: RoleInterface.user } as any,
    view: { id: ViewInterface.dashboard } as any,
  },
];
