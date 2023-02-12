import { Typography } from '@mui/material';

function PageHeader() {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Configurar cuenta
      </Typography>
      <Typography variant="subtitle2">
        {user.name}, aquí puedes configurar las preferencias de tu cuenta.
      </Typography>
    </>
  );
}

export default PageHeader;
