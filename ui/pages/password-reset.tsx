import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Container,
  InputAdornment,
  styled,
  IconButton,
  Divider,
  TextField,
  Badge
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { ReactElement } from 'react';
import Head from 'next/head';

import BaseLayout from 'src/layouts/BaseLayout';

import { passwordRegex } from '../src/helper/regex';
import { PasswordResetType } from '../src/types/password-reset.type';
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

function PasswordReset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);
  const { passwordReset } = useAuth();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setError
  } = useForm<PasswordResetType>();

  const onSubmit = handleSubmit(async (data: PasswordResetType) => {
    if (!showPassword && data.password !== data.password2) {
      setError('password2', {
        type: 'manual',
        message: 'Las contraseñas no coinciden'
      });
      return;
    }
    await passwordReset(data);
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    setShowRepeatPassword(!showRepeatPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
              <Typography variant="subtitle2">
                Restablece tu contraseña
              </Typography>
            </Box>

            <form onSubmit={onSubmit}>
              <Container maxWidth="sm">
                <Box textAlign="center">
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
                  {showRepeatPassword && (
                    <TextField
                      autoComplete="password"
                      label="Repite tu contraseña"
                      id="password2"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      type={'password'}
                      helperText={errors.password2?.message}
                      error={!!errors.password2?.message}
                      {...register('password2', {})}
                    />
                  )}
                </Box>

                <Divider sx={{ mb: 2 }}></Divider>
                <LoadingButton
                  sx={{ mb: 2 }}
                  size="large"
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {!isSubmitting ? (
                    <>Restablecer contraseña </>
                  ) : (
                    <>Cargando...</>
                  )}
                </LoadingButton>
              </Container>
            </form>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default PasswordReset;

PasswordReset.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
