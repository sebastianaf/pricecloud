export interface SettingsInterface {
  auth: {
    mfa: boolean;
    mfaFailedTries: number;
  };
  notification: {
    email: {
      priceDbUpdated: boolean;
      newsletter: boolean;
    };
  };
}

export const settingsDefault: SettingsInterface = {
  auth: {
    mfa: false,
    mfaFailedTries: 0,
  },
  notification: {
    email: {
      priceDbUpdated: false,
      newsletter: false,
    },
  },
};
