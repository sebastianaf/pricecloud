import { useState } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { protect } from '../../../../helper/protect';
import EC2Icon from 'react-aws-icons/dist/aws/logo/EC2';
import ComputeNodesTable from './ComputeTable';
import ComputeCreateModal from './ComputeModal';

function ComputeTab() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <ComputeCreateModal open={showModal} onClose={handleClose} />
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
                <EC2Icon size={32} /> Amazon EC2
              </Typography>
              <Typography variant="subtitle2">
                Crea tus nodos de computo en EC2.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="success"
              startIcon={<AddCircleOutlineTwoToneIcon />}
              onClick={handleClose}
            >
              Crear instancia
            </Button>
          </Box>
        </Grid>
        <ComputeNodesTable showModal={showModal} />
      </Grid>
    </>
  );
}

export default protect(ComputeTab);
