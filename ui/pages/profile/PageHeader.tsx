import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { protect } from '../../src/helper/protect';

function PageHeader() {
  const { user, getUser } = useAuth();
  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Configurar cuenta
      </Typography>
      <Typography variant="subtitle2">
        {user ? `${user?.firstName}, ` : `Hola, `} aquí puedes configurar las
        preferencias de tu cuenta.
      </Typography>
    </>
  );
}

export default protect(PageHeader);
