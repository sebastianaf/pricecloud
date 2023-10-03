import * as React from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
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
import { ModalProvider, useModal } from '../src/contexts/ModalContext';
import { AppContext, AppProvider } from '../src/contexts/AppContext';

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
        <title>Pricecloud</title>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <AppProvider>
        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SnackbarProvider
                maxSnack={5}
                autoHideDuration={5000}
                TransitionComponent={Fade}
                transitionDuration={500}
                preventDuplicate={false}
              >
                <ModalProvider>
                  <CssBaseline />
                  {getLayout(<Component {...pageProps} />)}
                </ModalProvider>
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </AppProvider>
    </CacheProvider>
  );
}

export default PricecloudApp;
