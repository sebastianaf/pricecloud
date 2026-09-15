import { ReactNode, useState, createContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

const STORAGE_KEY = 'appTheme';
const DARK_THEME = 'GreenFieldsTheme';
const LIGHT_THEME = 'PureLightTheme';

// Tema que se renderiza en el servidor y en el primer render del cliente. Tiene
// que ser un valor fijo: leer matchMedia o localStorage durante el render
// produce un HTML distinto al del servidor y React tira la hidratacion entera.
// La preferencia real se aplica en el useEffect de abajo.
const DEFAULT_THEME = DARK_THEME;

const prefersLight = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: light)').matches;

const systemTheme = (): string => (prefersLight() ? LIGHT_THEME : DARK_THEME);

const readStoredTheme = (): string | null => {
  // En navegacion privada o con las cookies bloqueadas, localStorage lanza al
  // leerlo; sin este try el ThemeProvider revienta y se lleva la app por delante.
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const ThemeContext = createContext((_themeName: string): void => {});

type ThemeProviderWrapperProps = {
  children: ReactNode;
};

const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  const [themeName, _setThemeName] = useState(DEFAULT_THEME);

  useEffect(() => {
    // Una eleccion manual guardada manda sobre el sistema operativo; si no hay
    // ninguna, se sigue la preferencia del sistema.
    const stored = readStoredTheme();
    _setThemeName(stored || systemTheme());

    if (stored || typeof window.matchMedia !== 'function') {
      return;
    }

    // Sin eleccion manual, la app sigue al sistema en vivo: cambiar el modo
    // claro/oscuro del SO repinta sin recargar.
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) =>
      _setThemeName(event.matches ? LIGHT_THEME : DARK_THEME);

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const theme = themeCreator(themeName);

  const setThemeName = (themeName: string): void => {
    try {
      window.localStorage.setItem(STORAGE_KEY, themeName);
    } catch {
      // Sin persistencia el tema dura lo que la pestana, que es preferible a
      // romper el cambio de tema.
    }
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
