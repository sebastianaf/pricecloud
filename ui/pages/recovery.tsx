import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Container,
  FormControl,
  InputAdornment,
  styled,
  IconButton,
  Badge,
  Divider,
  TextField
} from '@mui/material';
import NextLink from 'next/link';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { ReactElement } from 'react';

import Head from 'next/head';
import BaseLayout from 'src/layouts/BaseLayout';
import { LoginType } from '../src/types/FormStates';
import { emailRegex } from '../src/helper/regex';
import paths from '../src/helper/paths';
import { RecoveryType } from '../src/types/recovery.type';
import { useAuth } from '../src/contexts/AuthContext';
import { useRouter } from 'next/router';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(0)};
`
);

function Recovery() {
  const { recovery, isAuth, check } = useAuth();
  const router = useRouter();

  useEffect(() => {
    check();
    isAuth && router.push(paths.web.dashboard.root);
  }, [isAuth]);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit
  } = useForm<LoginType>();

  const onSubmit = handleSubmit((data: RecoveryType) => {
    recovery(data);
  });

  return (
    <>
      <Head>
        <title>Pricecloud | Recuperar contraseña</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center" sx={{ m: 2 }}>
              <Badge
                overlap="circular"
                color="success"
                badgeContent="v1.0.0"
                sx={{ cursor: 'pointer' }}
              >
                <NextLink href="/">
                  <img
                    alt="Pricecloud"
                    height={96}
                    src="/static/images/logo/pricecloud-logo.png"
                    draggable={false}
                  />
                </NextLink>
              </Badge>
              <Typography variant="h1" sx={{ mt: 2 }}>
                Pricecloud
              </Typography>
              <Typography variant="subtitle2">
                Restablece tu contraseña o{' '}
                <NextLink href={paths.web.login}>inicia sesión</NextLink>
              </Typography>
            </Box>

            <form onSubmit={onSubmit}>
              <Container maxWidth="sm">
                <Box textAlign="center">
                  <TextField
                    autoComplete="email"
                    fullWidth
                    sx={{ mb: 2 }}
                    className=""
                    id="email"
                    variant="outlined"
                    type="email"
                    label="Email"
                    {...register('email', {
                      required: {
                        value: true,
                        message: 'Por favor ingrese su correo electrónico'
                      },
                      pattern: {
                        value: emailRegex,
                        message:
                          'Por favor ingrese un correo electrónico válido'
                      }
                    })}
                    helperText={errors?.email?.message}
                    error={!!errors?.email?.message}
                  />
                </Box>

                <Divider sx={{ mb: 2 }}></Divider>
                <LoadingButton
                  size="large"
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {!isSubmitting ? <>Recuperar </> : <>Cargando...</>}
                </LoadingButton>
              </Container>
            </form>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Recovery;

Recovery.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
