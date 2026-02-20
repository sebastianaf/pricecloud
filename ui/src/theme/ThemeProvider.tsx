import { ReactNode, useState, createContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

export const ThemeContext = createContext((_themeName: string): void => {});

type ThemeProviderWrapperProps = {
  children: ReactNode;
};

const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  const [themeName, _setThemeName] = useState('GreenFieldsTheme');

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'GreenFieldsTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
