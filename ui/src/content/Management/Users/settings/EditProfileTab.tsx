import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  CircularProgress,
  Skeleton,
  LinearProgress
} from '@mui/material';
import { useEffect } from 'react';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from '@/components/Text';
import Label from '@/components/Label';
import { useAuth } from '../../../../contexts/AuthContext';
import { InfoOutlined } from '@mui/icons-material';
import { protect } from '../../../../helper/protect';

function EditProfileTab() {
  const { user, getUser } = useAuth();
  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Información personal
              </Typography>
              <Typography variant="subtitle2">
                Administre la información personal de su cuenta.
              </Typography>
            </Box>
            {/* <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Editar
            </Button> */}
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Nombre:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    {user ? (
                      <b>{`${user?.firstName}${
                        user?.secondName ? ` ${user?.secondName}` : ''
                      }${user?.firstLastName ? ` ${user?.firstLastName}` : ''}${
                        user?.secondLastName ? ` ${user?.secondLastName}` : ''
                      }`}</b>
                    ) : (
                      <CircularProgress size={16} />
                    )}
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Tipo de cuenta:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                    {user?.role?.label ? (
                      <Text color="black">
                        <b>{user?.role?.label}</b>
                      </Text>
                    ) : (
                      <Text color="black">
                        <b>N/D</b>
                      </Text>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Pais:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                    {user ? (
                      <Text color="black">
                        <b>{`${user?.country || `N/D`}`.toUpperCase()}</b>
                      </Text>
                    ) : (
                      <Text color="black">
                        <b>N/D</b>
                      </Text>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Configuración de la cuenta
              </Typography>
              <Typography variant="subtitle2">
                Administre los detalles relacionados con su cuenta.
              </Typography>
            </Box>
            {/* <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Editar
            </Button> */}
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Zona horaria:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {user ? (
                    <Text color="black">
                      <b>{user?.timezone}</b>
                    </Text>
                  ) : (
                    <Text color="black">
                      <b>N/D</b>
                    </Text>
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Estado de cuenta:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {user?.active ? (
                    <Label color="success">
                      <DoneTwoToneIcon fontSize="medium" />
                      <b>Activa</b>
                    </Label>
                  ) : (
                    <Label color="warning">
                      <InfoOutlined fontSize="medium" />
                      <b>N/D</b>
                    </Label>
                  )}
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Correos electrónicos
              </Typography>
              <Typography variant="subtitle2">
                Administre los detalles relacionados con sus correos
                electrónicos.
              </Typography>
            </Box>
            {/* <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Editar
            </Button> */}
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    ID de email:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {user?.email ? (
                    <Text color="black">
                      <b>{user?.email}</b>
                    </Text>
                  ) : (
                    <Text color="black">
                      <b>N/D</b>
                    </Text>
                  )}
                  <Box pl={1} component="span">
                    <Label color="success">Principal</Label>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default protect(EditProfileTab);
