import { RoleView } from '../entities/role-view.entity';
import { Role } from '../entities/role.entity';
import { View } from '../entities/view.entity';
import { RoleInterface } from '../interfaces/role.interface';
import { ViewInterface } from '../interfaces/view.interface';

export const roleViewData: Partial<RoleView>[] = [
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
