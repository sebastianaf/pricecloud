export interface CredentialsInterface {
  aws: {
    accessId: string | null;
    secretKey: string | null;
  };
}

export interface CredentialsResponseInterface {
  aws: {
    accessId: boolean;
    secretKey: boolean;
  };
}

export const credentialsDefault: CredentialsInterface = {
  aws: {
    accessId: null,
    secretKey: null,
  },
};

export const credentialsResponseDefault: CredentialsResponseInterface = {
  aws: {
    accessId: false,
    secretKey: false,
  },
};
