import { ReactNode, createContext, useContext, useState } from 'react';

type AppContextProps = {
  appName: string;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AppProvider({ children }: Props) {
  const appName = `Pricecloud`;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  return (
    <AppContext.Provider value={{ appName, userProfile, setUserProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
