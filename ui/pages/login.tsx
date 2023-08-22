import * as React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  FormControl,
  InputAdornment,
  styled,
  IconButton,
  FilledInput,
  InputLabel,
  Badge,
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
  padding: ${theme.spacing(0)};
`
);

function SignIn() {
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
        <title>Pricecloud | Iniciar sesión</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <NextLink href="/">
              <Box textAlign="center" sx={{ m: 2 }}>
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
              <Box textAlign="center" >
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
              </Box>

              <Divider sx={{ mb: 2 }}></Divider>
              <Button /* href="/dashboard" */ variant="contained" fullWidth>
                Acceder
              </Button>
            </Container>
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
