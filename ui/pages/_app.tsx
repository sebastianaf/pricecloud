import * as React from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Fade from '@mui/material/Fade';

/* 
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'; */

import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import 'src/styles/global.css';
import { ModalProvider } from '../src/contexts/ModalContext';
//import { AppProvider } from '../src/contexts/AppContext';
import { SnackbarProvider } from '../src/contexts/SnackbarContext';
import { AuthProvider } from '../src/contexts/AuthContext';

const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface TokyoAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function PricecloudApp(props: TokyoAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  React.useEffect(() => {
    // El service worker solo existe para que el navegador ofrezca instalar la
    // PWA (Chrome exige uno con manejador `fetch`); no cachea nada. Se registra
    // tras `load` para no competir con la primera pintada, y se omite en
    // desarrollo, donde dejaria un worker activo entre recargas de Next.
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Un fallo al registrar no debe romper la app: la PWA es una mejora,
        // no un requisito para usarla.
      });
    };

    // Ojo con el orden: este efecto corre despues de la hidratacion, que suele
    // ser posterior al evento `load`. Suscribirse a `load` sin mas dejaba el
    // service worker sin registrar porque el evento ya habia pasado.
    if (document.readyState === 'complete') {
      register();
      return;
    }

    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  /* const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }); */

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        {/* Sin <title> aqui: cada pagina lo pone con <Seo />. Dejarlo tambien
            en _app hacia que Next emitiera dos <title> en el head. */}
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Safari no lee el manifest para "Agregar a inicio": necesita estos
            meta puntuales para abrir como app y no como pestana. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Pricecloud" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/favicon.ico" />
        {/* Dos theme-color: el navegador pinta su barra segun el tema del
            sistema, igual que hace la app desde que hay tema claro.
            El `key` es imprescindible: next/head deduplica los <meta> por
            `name`, asi que sin el solo sobrevivia el ultimo de los dos. */}
        <meta
          key="theme-color-light"
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f2f5f9"
        />
        <meta
          key="theme-color-dark"
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#141c23"
        />
      </Head>
      {/* <AppProvider> */}
        <SnackbarProvider>
          <AuthProvider>
            <SidebarProvider>
              <ThemeProvider>
                <ModalProvider>
                  <CssBaseline />
                  {getLayout(<Component {...pageProps} />)}
                </ModalProvider>
              </ThemeProvider>
            </SidebarProvider>
          </AuthProvider>
        </SnackbarProvider>
      {/* </AppProvider> */}
    </CacheProvider>
  );
}

export default PricecloudApp;
