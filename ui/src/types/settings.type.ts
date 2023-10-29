export interface SettingsType {
  authMfa?: boolean;
  notificationEmailPriceDbUpdated?: boolean;
  notificationEmailNewsletter?: boolean;
}

export interface SettingsInterface {
  auth: {
    mfa: boolean;
  };
  notification: {
    email: {
      priceDbUpdated: boolean;
      newsletter: boolean;
    };
  };
}

export type NotificationSettingsType =
  | 'notificationEmailNewsletter'
  | 'notificationEmailPriceDbUpdated';

export type AuthSettingsType = 'authMfa';
