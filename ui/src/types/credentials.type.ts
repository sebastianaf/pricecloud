export interface CredentialsResponse {
  awsAccessId?: boolean;
  awsSecretKey?: boolean;
}

export interface CredentialsType {
  awsAccessId?: string;
  awsSecretKey?: string;
}

export interface CredentialsRequest {
  aws: {
    accessId: boolean;
    secretKey: boolean;
  };
}
