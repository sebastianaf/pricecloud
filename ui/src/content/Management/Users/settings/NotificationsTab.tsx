import { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Switch
} from '@mui/material';

function NotificationsTab() {
  const [state, setState] = useState({
    checkedA: true,
    checkedB: false,
    checkedC: true,
    checkedD: false
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">Cuenta</Typography>
          <Typography variant="subtitle2">
            Indica qué notificaciones quieres recibir
          </Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="Notificación de actualización"
                secondary="Enviar un informe cuando la base de datos de precios sea actualizada"
              />
              <Switch
                color="primary"
                checked={state.checkedA}
                onChange={handleChange}
                name="checkedA"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="Newsletter"
                secondary="Recibir notificaciones de novedades en los servicios del cloud"
              />
              <Switch
                color="primary"
                checked={state.checkedB}
                onChange={handleChange}
                name="checkedB"
              />
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default NotificationsTab;
