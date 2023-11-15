import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { protect } from '../../../../helper/protect';

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
        Configurar proveedores
      </Typography>
      <Typography variant="subtitle2">
        {user ? `${user?.firstName}, ` : `Hola, `} aquí puedes configurar las
        credenciales y otros parámetros de acceso a tus proveedores de cloud.
      </Typography>
    </>
  );
}

export default protect(PageHeader);
