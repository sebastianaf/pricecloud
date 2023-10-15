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
import { useModal } from '../contexts/ModalContext';
import { NotificationType } from '../types/notification.type';

const handleIcon = (type: NotificationType) => {
  if (type === 'success') {
    return <SuccessIcon fontSize="medium" color="success" />;
  } else if (type === 'error') {
    return <ErrorIcon fontSize="medium" color="error" />;
  } else if (type === 'warning') {
    return <WarningIcon fontSize="medium" color="warning" />;
  }
  return <InfoIcon fontSize="medium" color="info" />;
};

const Modal = () => {
  const {
    isModalOpen,
    openModal,
    closeModal,
    modalData: { title, message, buttonText, notificationType }
  } = useModal();

  const handleOpen = () => {
    openModal();
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div>
      <Dialog open={isModalOpen} onClose={handleClose}>
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
            gap={1}
          >
            {handleIcon(notificationType)}
            {title}
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={notificationType}>
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Modal;
