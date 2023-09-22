import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';

function MyComponent() {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar('Esto es una notificación!', { variant: 'info' });
  };

  return (
    <Button onClick={handleClick}>Mostrar Notificación</Button>
  );
}

export default MyComponent;
