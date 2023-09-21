import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Close';

interface ModalProps {
  title?: string;
  buttonText?: string;
  body?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}
const handleIcon = (type: string) => {
  if (type === 'success') {
    return <SuccessIcon fontSize="medium" color="success" />;
  } else if (type === 'error') {
    return <ErrorIcon fontSize="medium" color="error" />;
  } else if (type === 'warning') {
    return <WarningIcon fontSize="medium" color="warning" />;
  }
  return <InfoIcon fontSize="medium" color="info" />;
};

const Modal: React.FC<ModalProps> = ({
  title = `Notificación`,
  buttonText = 'Cerrar',
  body = 'Al parecer esta notificación no tiene contenido',
  type = 'info'
}) => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
            gap={1}
          >
            {handleIcon(type)}
            {title}
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={type}>
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Modal;
