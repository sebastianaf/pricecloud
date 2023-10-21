export type UserType = {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  loginCount: number;
  isEmailVerified: boolean;
  role: {
    id: number;
    label: string;
  };
  country: string;
  timezone: string;
  active: boolean;
  language: string;
};
