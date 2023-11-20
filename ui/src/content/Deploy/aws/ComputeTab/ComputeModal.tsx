import { FC } from 'react';
import {
  Container,
  Grid,
  Dialog,
  TextField,
  Typography,
  Box
} from '@mui/material';
import Ec2Logo from 'react-aws-icons/dist/aws/logo/EC2';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { HttpStatusCode } from 'axios';

import { customAxios } from '../../../../helper/customAxios';
import paths from '../../../../helper/paths';

interface CreateEC2Node {
  nodeName: string;
  imageId: string;
  sizeId: string;
}

const ComputeCreateModal: FC<{ open: boolean; onClose: () => void }> = ({
  open = false,
  onClose
}) => {
  const {
    formState: { errors, isSubmitting },
    reset,
    register,
    handleSubmit
  } = useForm<CreateEC2Node>();

  const onSubmit = handleSubmit(async (data: CreateEC2Node) => {
    const response = await customAxios.post(paths.api.compute.node, data);
    if (response.status === HttpStatusCode.Created) {
      reset();
      onClose();
    }
  });

  return (
    <Dialog maxWidth="xs" open={open} onClose={onClose}>
      <Grid xs={12}>
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
            <Ec2Logo size={64} />
            <Box>
              <Typography variant="h3">Crear instancia</Typography>
              <Typography variant="subtitle2">
                Use tamaños e imágenes validas
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
            {...register('nodeName', {
              required: {
                value: true,
                message: 'Por favor indique el nombre del nodo'
              }
            })}
            helperText={errors?.nodeName?.message}
            error={!!errors?.nodeName?.message}
          />
          <TextField
            id="imageId"
            variant="outlined"
            label="Imagen"
            sx={{ mb: 2 }}
            autoComplete="off"
            fullWidth
            {...register('imageId', {
              required: {
                value: true,
                message: 'Por favor la imagen para deplegar en el nodo'
              }
            })}
            helperText={errors?.imageId?.message}
            error={!!errors?.imageId?.message}
          />
          <TextField
            id="sizeId"
            variant="outlined"
            label="Tamaño"
            sx={{ mb: 2 }}
            autoComplete="off"
            fullWidth
            {...register('sizeId', {
              required: {
                value: true,
                message: 'Por favor indique el tamaño del nodo'
              }
            })}
            helperText={errors?.sizeId?.message}
            error={!!errors?.sizeId?.message}
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

export default ComputeCreateModal;
