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
    role: { id: RoleInterface.admin } as Role,
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
    id: ViewInterface.profile,
    label: 'Configurar cuenta',
  },
  {
    id: ViewInterface.dashboardExplore,
    label: 'Explorar servicios',
  },
  {
    id: ViewInterface.dashboardCompare,
    label: 'Comparar servicios',
  },
  {
    id: ViewInterface.providerExplore,
    label: 'Explorar proveedores',
  },
  {
    id: ViewInterface.providerSettings,
    label: 'Configurar proveedores',
  },
  {
    id: ViewInterface.deployAws,
    label: 'AWS',
  },
  {
    id: ViewInterface.managementUsers,
    label: 'Gestion de usuarios',
  },
  {
    id: ViewInterface.managementPrices,
    label: 'Gestión de precios',
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
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.dashboard } as View,
  },
  {
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.profile } as View,
  },
  {
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.dashboardExplore } as View,
  },
  {
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.dashboardCompare } as View,
  },
  {
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.providerExplore } as View,
  },
  {
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.providerSettings } as View,
  },
  {
    role: { id: RoleInterface.user } as Role,
    view: { id: ViewInterface.deployAws } as View,
  },
];
