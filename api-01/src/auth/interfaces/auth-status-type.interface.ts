export enum AuthStatusTypeInterface {
  mfa = `mfa`,
}

export interface AuthStatusInterface {
  mfa: boolean;
}

export const defaultAuthStatus = {
  mfa: true,
};
