import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Divider,
  Dialog,
  Container,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Lock } from '@mui/icons-material';

import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { PasswordChangeType } from '../types/password-change.type';

function MultiFactorAuthenticationModal({ open, onClose, loginData }) {
  const { signin } = useAuth();
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRefs[0].current && inputRefs[0].current.focus();
      }, 0);
    }
  }, [open]);

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset
  } = useForm<PasswordChangeType>();

  const onSubmit = handleSubmit(async () => {
    setTimeout(async () => {
      handleClose();
      await signin({ ...loginData, code: code.join('') });
    }, 0);
  });

  const handleClose = () => {
    setCode(['', '', '', '']);
    reset();
    onClose();
  };

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = value;
      return newCode;
    });
    if (value && index === 3) {
      setTimeout(() => {
        submitButtonRef.current.click();
      }, 0);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={onSubmit}>
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <Box
            textAlign="center"
            sx={{ mb: 2 }}
            display={`flex`}
            flexDirection={`row`}
            justifyContent={`center`}
            alignItems={`center`}
            gap={2}
          >
            <Lock color="primary" />{' '}
            <Typography
              textAlign={'center'}
              variant="h4"
              sx={{ my: 2 }}
              gutterBottom
            >
              Código de verificación
            </Typography>
          </Box>
          <Box
            textAlign="center"
            display="flex"
            justifyContent="space-between"
            maxWidth={280}
            margin="auto"
            gap={2}
          >
            {code.map((value, index) => (
              <TextField
                key={index}
                type="number"
                inputProps={{
                  maxLength: 1,
                  inputMode: 'numeric',
                  pattern: '\\d',
                  style: {
                    textAlign: 'center',
                    appearance: 'textfield',
                    MozAppearance: 'textfield',
                    margin: 0,
                    fontSize: '1.2rem'
                  }
                }}
                variant="outlined"
                value={value}
                onChange={(event) => handleInputChange(index, event)}
                inputRef={inputRefs[index]}
                sx={{
                  'input::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0
                  },
                  'input::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0
                  }
                }}
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }}></Divider>
          <LoadingButton
            sx={{ mb: 2 }}
            size="large"
            loading={isSubmitting}
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {!isSubmitting ? <>Acceder </> : <>Cargando...</>}
          </LoadingButton>
          <button
            type="submit"
            ref={submitButtonRef}
            style={{ display: 'none' }}
          >
            Submit
          </button>
        </Container>
      </form>
    </Dialog>
  );
}

export default MultiFactorAuthenticationModal;
