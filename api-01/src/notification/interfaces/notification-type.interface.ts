export enum NotificationTypeInterface {
  priceDbUpdated = 'priceDbUpdated',
  newsletter = 'newsletter',
}

export interface NotificationStatusInterface {
  priceDbUpdated: boolean;
  newsletter: boolean;
}

export const defaultNotificationStatus = {
  priceDbUpdated: false,
  newsletter: false,
};
