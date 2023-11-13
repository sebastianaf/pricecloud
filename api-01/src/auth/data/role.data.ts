import { Role } from '../entities/role.entity';
import { RoleInterface } from '../interfaces/role.interface';

export const roleData: Partial<Role>[] = [
  {
    id: RoleInterface.admin,
    label: 'Admin',
  },
  {
    id: RoleInterface.user,
    label: 'Viewer',
  },
];
