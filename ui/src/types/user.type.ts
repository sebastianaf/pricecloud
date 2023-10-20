export type UserType = {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  loginCount: number;
  isEmailVerified: boolean;
  country: string;
  timezone: string;
  active: boolean;
  role: {
    id: number;
    label: string;
  };
};
