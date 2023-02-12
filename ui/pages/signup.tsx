import * as React from 'react';
import {
  Box,
  Card,
  Container,
  Button,
  FormControl,
  InputAdornment,
  styled,
  IconButton,
  FilledInput,
  InputLabel,
  Badge,
  Typography,
  Divider
} from '@mui/material';
import NextLink from 'next/link';
import Head from 'next/head';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

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
  padding: ${theme.spacing(6)};
`
);

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Head>
        <title>Pricecloud | Registrarse</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <NextLink href="/">
              <Box textAlign="center" sx={{ m: 4 }}>
                <Badge
                  overlap="circular"
                  color="success"
                  badgeContent="v1.0"
                  sx={{ cursor: 'pointer' }}
                >
                  <img
                    alt="Pricecloud"
                    height={96}
                    src="/static/images/logo/pricecloud-logo.png"
                    draggable={false}
                  />
                </Badge>
                <Typography variant="h1" sx={{ mt: 2 }}>
                  Pricecloud
                </Typography>
                <Typography variant="subtitle2">Crear una cuenta</Typography>
              </Box>
            </NextLink>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', p: 4 }}>
                <Box textAlign="center" sx={{ mb: 2 }}>
                  <FormControl variant="filled" fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="name">Nombre</InputLabel>
                    <FilledInput id="name" type="text" />
                  </FormControl>

                  <FormControl variant="filled" fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="email">Correo electrónico</InputLabel>
                    <FilledInput id="email" type="email" />
                  </FormControl>

                  <FormControl variant="filled" fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                    <FilledInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
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
                      }
                    />
                  </FormControl>

                  <FormControl variant="filled" fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="passwordRepeat">
                      Repita su contraseña
                    </InputLabel>
                    <FilledInput
                      id="passwordRepeat"
                      type={showPassword ? 'text' : 'password'}
                    />
                  </FormControl>
                </Box>
                <Divider sx={{ mb: 4 }}></Divider>
                <Button href="/dashboard" variant="contained" fullWidth>
                  Registrase
                </Button>
              </Card>
            </Container>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
