import { useState, useEffect } from 'react';
import paths from '../helper/paths';
import { SettingsInterface, SettingsType } from '../types/settings.type';
import { customAxios } from '../helper/customAxios';
import {
  CredentialsRequest,
  CredentialsResponse,
  CredentialsType
} from '../types/credentials.type';

function useCredentials(): {
  setCredentials: (credentials: CredentialsType) => Promise<void>;
  credentials: CredentialsResponse | null;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentialsState] = useState<CredentialsResponse>({
    awsAccessId: false,
    awsSecretKey: false
  });

  useEffect(() => {
    const handleGetCredentials = async () => {
      const credentials = await getCredentials();

      return credentials;
    };
    handleGetCredentials();
  }, []);

  const getCredentials = async () => {
    try {
      setIsLoading(true);
      const credentialsData = (
        await customAxios.get<CredentialsRequest>(paths.api.user.credentials)
      ).data;

      const newCredentials: CredentialsResponse = {
        awsAccessId: credentialsData.aws.accessId,
        awsSecretKey: credentialsData.aws.secretKey
      };
      setCredentialsState(newCredentials);
      return newCredentials;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const setCredentials = async (credentialsSettings: CredentialsType) => {
    try {
      setCredentialsState({
        awsAccessId:
          credentialsSettings.awsAccessId !== undefined ? true : false,
        awsSecretKey:
          credentialsSettings.awsSecretKey !== undefined ? true : false
      });
      await customAxios.put(paths.api.user.credentials, {
        ...credentialsSettings
      });
    } catch (error) {
    } finally {
    }
  };

  return {
    credentials,
    isLoading,
    setCredentials
  };
}

export default useCredentials;
