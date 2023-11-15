import { ChangeEvent, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Switch,
  CircularProgress
} from '@mui/material';
import { protect } from '../../../../helper/protect';
import useSettings from '../../../../hooks/useSettings';
import { NotificationSettingsType } from '../../../../types/settings.type';

function NotificationsTab() {
  const { isLoading, setSettings, settings } = useSettings();

  const handleChange = async (
    event: ChangeEvent<HTMLInputElement>,
    notificationSettingsType: NotificationSettingsType
  ) => {
    const { checked } = event.target;
    await setSettings({ [notificationSettingsType]: checked });
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
                checked={
                  settings ? settings.notificationEmailPriceDbUpdated : false
                }
                onChange={(event) =>
                  handleChange(event, 'notificationEmailPriceDbUpdated')
                }
                disabled={isLoading}
              />
              {isLoading && <CircularProgress size={24} />}
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
                checked={
                  settings ? settings.notificationEmailNewsletter : false
                }
                onChange={(event) =>
                  handleChange(event, 'notificationEmailNewsletter')
                }
                disabled={isLoading}
              />
              {isLoading && <CircularProgress size={24} />}
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default protect(NotificationsTab);
