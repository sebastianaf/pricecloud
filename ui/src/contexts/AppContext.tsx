import { ReactNode, createContext } from 'react';

type AppContext = {
  appName: string;
};

export const AppContext = createContext<AppContext>({} as AppContext);

type Props = {
  children: ReactNode;
};

export function AppProvider({ children }: Props) {
  const appName = `Pricecloud`;
  return (
    <AppContext.Provider value={{ appName }}>{children}</AppContext.Provider>
  );
}
