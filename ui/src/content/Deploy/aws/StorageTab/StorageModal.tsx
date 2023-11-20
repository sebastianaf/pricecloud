import { FC } from 'react';
import {
  Container,
  Button,
  OutlinedInput,
  styled,
  Grid,
  Dialog,
  TextField,
  Typography,
  Box
} from '@mui/material';
import S3Logo from 'react-aws-icons/dist/aws/logo/S3';
import { LoadingButton } from '@mui/lab';
import { HttpStatusCode } from 'axios';

import { useForm } from 'react-hook-form';
import { customAxios } from '../../../../helper/customAxios';
import paths from '../../../../helper/paths';

interface CreateS3Container {
  bucketName: string;
}

const StorageModal: FC<{ open: boolean; onClose: () => void }> = ({
  open = false,
  onClose
}) => {
  const {
    formState: { errors, isSubmitting },
    reset,
    register,
    handleSubmit
  } = useForm<CreateS3Container>();

  const onSubmit = handleSubmit(async (data: CreateS3Container) => {
    const response = await customAxios.post(paths.api.storage.root, data);
    if (response.status === HttpStatusCode.Created) {
      reset();
      onClose();
    }
  });

  return (
    <Dialog maxWidth="xs" open={open} onClose={onClose}>
      <Grid item xs={12}>
        <Container
          sx={{
            my: 4,
            p: 2
          }}
        >
          <Box
            sx={{
              mb: 4,
              gap: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <S3Logo size={64} />
            <Box>
              <Typography variant="h3">Crear bucket</Typography>
              <Typography variant="subtitle2">
                Almacenamiento escalable de S3.
              </Typography>
            </Box>
          </Box>

          <TextField
            id="name"
            variant="outlined"
            label="Nombre"
            sx={{ mb: 2 }}
            autoComplete="off"
            fullWidth
            {...register('bucketName', {
              required: {
                value: true,
                message: 'Por favor indique el nombre del contenedor'
              },
              pattern: {
                value: /^[a-z0-9]+$/g,
                message:
                  'Solo se permiten caracteres alfanuméricos y en minúsculas sin espacios'
              }
            })}
            helperText={errors?.bucketName?.message}
            error={!!errors?.bucketName?.message}
          />
          <LoadingButton
            size="large"
            loading={isSubmitting}
            onClick={onSubmit}
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth
          >
            Crear
          </LoadingButton>
        </Container>
      </Grid>
    </Dialog>
  );
};

export default StorageModal;
