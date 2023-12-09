import { Typography, Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useAuth } from '../../../src/contexts/AuthContext';

function PageHeader() {
  const { user, getUser } = useAuth();
  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Usuarios
        </Typography>
        <Typography variant="subtitle2">
          {user?.firstName ? `${user.firstName}. aquí ` : `Aquí `}puedes
          administrar y ver los usuarios de la aplicación.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
