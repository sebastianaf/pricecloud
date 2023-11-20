import { useState } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { protect } from '../../../../helper/protect';
import S3Icon from 'react-aws-icons/dist/aws/logo/S3';
import StorageTable from './StorageTable';
import StorageModal from './StorageModal';

function ComputeTab() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <StorageModal open={showModal} onClose={handleClose} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            gap={2}
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  display: 'flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <S3Icon size={32} /> Amazon S3
              </Typography>
              <Typography variant="subtitle2">
                Crea tus contenedores de almacenamiento en S3.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="success"
              startIcon={<AddCircleOutlineTwoToneIcon />}
              onClick={handleClose}
            >
              Crear bucket
            </Button>
          </Box>
        </Grid>
        <StorageTable showModal={showModal} />
      </Grid>
    </>
  );
}

export default protect(ComputeTab);
