import { useState, ChangeEvent, useEffect } from 'react';
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
import { customAxios } from '../../../../helper/customAxios';
import paths from '../../../../helper/paths';
import { protect } from '../../../../helper/protect';

type NotificationType = 'newsletter' | 'priceDbUpdated';

export interface NotificationStatus {
  priceDbUpdated: boolean;
  newsletter: boolean;
}

function NotificationsTab() {
  const [notificationData, setNotificationData] = useState({
    priceDbUpdated: false,
    newsletter: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const getNotificationData = async () => {
    try {
      setIsLoading(true);
      const response = await customAxios.get<NotificationStatus>(
        paths.api.notification.status
      );

      setNotificationData(response.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotification = async (
    notificationType: NotificationType,
    active: boolean
  ) => {
    try {
      await customAxios.put(paths.api.notification.status, {
        notificationType,
        active
      });
    } catch (error) {}
  };

  useEffect(() => {
    getNotificationData();
  }, []);

  const handleChange = async (
    event: ChangeEvent<HTMLInputElement>,
    notificationType: NotificationType
  ) => {
    const { checked } = event.target;
    setNotificationData((prevData) => ({
      ...prevData,
      [notificationType]: checked
    }));

    await updateNotification(notificationType, checked);
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
                checked={notificationData?.priceDbUpdated}
                onChange={(event) => handleChange(event, 'priceDbUpdated')}
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
                checked={notificationData?.newsletter}
                onChange={(event) => handleChange(event, 'newsletter')}
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
