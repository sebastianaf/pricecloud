import * as React from 'react';
import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  FormControl,
  InputAdornment,
  styled,
  IconButton,
  FilledInput,
  InputLabel
} from '@mui/material';
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
        <title>Pricecloud | Login</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Box textAlign="center" sx={{ m: 4 }}>
                  <img
                    alt="Pricecloud"
                    height={96}
                    src="/static/images/logo/pricecloud-logo.png"
                    draggable={false}
                  />
                  <Typography variant="h1" sx={{ my: 2 }}>
                    Pricecloud
                  </Typography>
                </Box>

                <Box textAlign="center" sx={{ mx: 2 }}>
                  <FormControl variant="filled" fullWidth sx={{ mb: 1}}>
                    <InputLabel htmlFor="email">Correo electrónico</InputLabel>
                    <FilledInput id="email" type="email" />
                  </FormControl>

                  <FormControl variant="filled" fullWidth sx={{ mb: 1}}>
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

                <Button href="/dashboard" variant="outlined" sx={{ m: 2 }}>
                  Iniciar sesión
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
