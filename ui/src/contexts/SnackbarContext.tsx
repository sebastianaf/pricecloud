import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';
import { NotificationType } from '../types/notification.type';
import { Alert, Snackbar } from '@mui/material';

interface SnackbarContextProps {
  showSnackbar?: (message: string, variant: NotificationType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined
);

export let SnackbarContextReference: SnackbarContextProps = {};

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<NotificationType>();

  const showSnackbar = (
    message: string,
    notificationType: NotificationType
  ) => {
    setSnackbarMessage(message);
    setSnackbarVariant(notificationType);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    SnackbarContextReference.showSnackbar = showSnackbar;
  }, [showSnackbar]);

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={7000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        inlist={true}
      >
        <Alert
          className={`custom-alert`}
          onClose={closeSnackbar}
          severity={snackbarVariant}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
