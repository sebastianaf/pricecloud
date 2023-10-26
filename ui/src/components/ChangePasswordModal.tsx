import { MouseEvent, useEffect, useState } from 'react';
import {
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Dialog,
  Container,
  TextField
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { passwordRegex } from '../helper/regex';
import { PasswordChangeType } from '../types/password-change.type';
import { useRouter } from 'next/router';

function ChangePasswordModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);
  const { passwordChange } = useAuth();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setError,
    reset
  } = useForm<PasswordChangeType>();

  const onSubmit = handleSubmit(async (data: PasswordChangeType) => {
    if (!showNewPassword && data.newPassword !== data.repeatedNewPassword) {
      setError('newPassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden'
      });
      return;
    }
    const isSuccess = await passwordChange(data);
    if (isSuccess) {
      onClose();
    }
  });

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
    setShowRepeatPassword(!showRepeatPassword);
  };

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={onSubmit}>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Box textAlign="center">
            <TextField
              autoComplete="password"
              label="Contraseña actual"
              id="password0"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              type={showOldPassword ? 'text' : 'password'}
              {...register('oldPassword', {
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
              helperText={errors?.oldPassword?.message}
              error={!!errors?.oldPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowOldPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              autoComplete="password"
              label="Nueva contraseña"
              id="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword', {
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
              helperText={errors?.newPassword?.message}
              error={!!errors?.newPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {showRepeatPassword && (
              <TextField
                autoComplete="password"
                label="Repite tu nueva contraseña"
                id="password2"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                type={'password'}
                helperText={errors.repeatedNewPassword?.message}
                error={!!errors.repeatedNewPassword?.message}
                {...register('repeatedNewPassword', {})}
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
            {!isSubmitting ? <>Cambiar contraseña </> : <>Cargando...</>}
          </LoadingButton>
        </Container>
      </form>
    </Dialog>
  );
}

export default ChangePasswordModal;
