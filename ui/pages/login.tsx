import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  styled,
  TextField
} from '@mui/material';
import Head from 'next/head';
import { SupervisedUserCircle, PasswordRounded } from '@mui/icons-material';
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

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonSearch = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

function Login() {
  return (
    <>
      <Head>
        <title>Status - 404</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <img alt="404" height={180} src="/static/images/status/404.svg" />
              <Typography variant="h2" sx={{ my: 2 }}>
                The page you were looking for doesn't exist.
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                It's on us, we moved the content to a different page. The search
                below should help!
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 2 }}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <TextField
                    id="user"
                    label="Correo electrónico"
                    type="email"
                    variant="filled"
                  />
                  <TextField
                    id="user"
                    label="Correo electrónico"
                    type="password"
                    variant='filled'
                  />
                  <OutlinedInputWrapper
                    type="text"
                    placeholder="Contraseña"
                    startAdornment={
                      <InputAdornment position="start">
                        <PasswordRounded />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Divider sx={{ my: 2 }}></Divider>
                <Button href="/" variant="outlined">
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
