import { View } from '../entities/view.entity';
import { ViewInterface } from '../interfaces/view.interface';

export const viewData: Partial<View>[] = [
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
