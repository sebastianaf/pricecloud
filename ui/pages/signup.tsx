import * as React from 'react';
import { useEffect } from 'react';
import {
  Box,
  Container,
  InputAdornment,
  styled,
  IconButton,
  Badge,
  Typography,
  Divider,
  TextField
} from '@mui/material';
import NextLink from 'next/link';
import Head from 'next/head';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';

import BaseLayout from 'src/layouts/BaseLayout';
import { SignupType } from '../src/types/signup.type';
import paths from '../src/helper/paths';
import { emailRegex, passwordRegex } from '../src/helper/regex';
import { useAuth } from '../src/contexts/AuthContext';

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

function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit
  } = useForm<SignupType>();
  const { signup, isAuth, check } = useAuth();
  const router = useRouter();

  useEffect(() => {
    check();
    isAuth && router.push(paths.web.dashboard.root);
  }, [isAuth]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = handleSubmit(async (data: SignupType) => {
    await signup(data);
  });

  return (
    <>
      <Head>
        <title>Pricecloud | Registro</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center" sx={{ m: 2 }}>
              <Badge
                overlap="circular"
                color="success"
                badgeContent="v1.0"
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
                Crea una cuenta o{' '}
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

                  <Box display={'flex'} flexDirection={`row`} gap={2}>
                    <TextField
                      label="Primer Nombre"
                      id="firstName"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      type="text"
                      {...register('firstName', {
                        required: {
                          value: true,
                          message: 'Por favor ingrese su primer nombre'
                        }
                      })}
                      helperText={errors?.firstName?.message}
                      error={!!errors?.firstName?.message}
                    />
                    <TextField
                      label="Primer apellido"
                      id="firstLastName"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      type="text"
                      {...register('firstLastName', {
                        required: {
                          value: true,
                          message: 'Por favor ingrese su primer apellido'
                        }
                      })}
                      helperText={errors?.firstLastName?.message}
                      error={!!errors?.firstLastName?.message}
                    />
                  </Box>

                  <TextField
                    autoComplete="password"
                    label="Contraseña"
                    id="password"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: {
                        value: true,
                        message: 'Por favor indique una contraseña'
                      },
                      pattern: {
                        value: passwordRegex,
                        message:
                          'Al menos 8 caracteres, una mayúscula, una minúscula y un número'
                      }
                    })}
                    helperText={errors?.password?.message}
                    error={!!errors?.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
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
                  {!isSubmitting ? <>Crear cuenta</> : <>Iniciando...</>}
                </LoadingButton>
              </Container>
            </form>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Signup;

Signup.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
