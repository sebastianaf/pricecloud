export interface UserProfile {
  id: string;
  email: string;
  loginCount: number;
  role: Role;
}

export interface RoleView {
  id: string;
  createdAt: string;
  updatedAt: string;
  view: Role;
}

export interface Role {
  id: number;
  label: string;
  createdAt: string;
  updatedAt: string;
  roleViews?: RoleView[];
}
