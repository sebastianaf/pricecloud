import { useState, useEffect } from 'react';
import paths from '../helper/paths';
import { SettingsInterface, SettingsType } from '../types/settings.type';
import { customAxios } from '../helper/customAxios';

function useSettings(): {
  setSettings: (settings: SettingsType) => Promise<void>;
  settings: SettingsType | null;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettingsState] = useState<SettingsType>({
    notificationEmailNewsletter: false,
    notificationEmailPriceDbUpdated: false,
    authMfa: false
  });

  useEffect(() => {
    const handleGetSettings = async () => await getSettings();
    handleGetSettings();
  }, []);

  const getSettings = async () => {
    try {
      setIsLoading(true);
      const settingsData = (
        await customAxios.get<SettingsInterface>(paths.api.user.settings)
      ).data;

      const newSettings: SettingsType = {
        notificationEmailNewsletter: settingsData.notification.email.newsletter,
        notificationEmailPriceDbUpdated:
          settingsData.notification.email.priceDbUpdated,
        authMfa: settingsData.auth.mfa
      };
      setSettingsState(newSettings);
      return newSettings;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const setSettings = async (settingsType: SettingsType) => {
    try {
      setSettingsState({ ...settings, ...settingsType });
      await customAxios.put(paths.api.user.settings, {
        ...settingsType
      });
    } catch (error) {
    } finally {
    }
  };

  return {
    settings,
    isLoading,
    setSettings
  };
}

export default useSettings;
