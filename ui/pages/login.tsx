import { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import type { ReactElement } from 'react';

import Head from 'next/head';
import BaseLayout from 'src/layouts/BaseLayout';
import { Login } from '../src/models/FormStates';
import { emailRegex, passwordRegex } from '../src/helper/regex';
/* import { authAxios } from '../src/helper/authAxios';
import { path } from '../src/helper/path'; */
import { LoadingButton } from '@mui/lab';
import useAuth from '../src/hooks/useAuth';
import { useModal } from '../src/contexts/ModalContext';

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

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, []);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit
  } = useForm<Login>();

  const onSubmit = handleSubmit(async (data: Login) => {
    await login(data);
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <Head>
        <title>Pricecloud | Iniciar sesión</title>
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
              <Typography variant="subtitle2">Crear una cuenta</Typography>
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

                  <FormControl variant="filled" fullWidth sx={{ mb: 2 }}>
                    {/* <InputLabel htmlFor="password">Contraseña</InputLabel> */}
                  </FormControl>
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
                  {!isSubmitting ? <>Acceder</> : <>Iniciando...</>}
                </LoadingButton>
              </Container>
            </form>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default SignIn;

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
