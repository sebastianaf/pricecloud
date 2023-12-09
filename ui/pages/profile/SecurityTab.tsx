import { useState, MouseEvent, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  Switch,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  CircularProgress,
  styled
} from '@mui/material';

import { useAuth } from '../../src/contexts/AuthContext';
import { protect } from '../../src/helper/protect';
import paths from '../../src/helper/paths';
import ChangePasswordModal from '../../src/components/ChangePasswordModal';
import { useRouter } from 'next/router';
import useSettings from '../../src/hooks/useSettings';
import { AuthSettingsType } from '../../src/types/settings.type';


function SecurityTab() {
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { loginData, getLoginData } = useAuth();
  const router = useRouter();
  const { isLoading, setSettings, settings } = useSettings();

  useEffect(() => {
    const handleGetLoginData = async () => await getLoginData();
    handleGetLoginData();
  }, []);

  const handleChange = async (
    event: ChangeEvent<HTMLInputElement>,
    authSettingsType: AuthSettingsType
  ) => {
    const { checked } = event.target;
    await setSettings({ [authSettingsType]: checked });
  };

  const handleChangePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeShowModal = () => {
    setShowPasswordChangeModal(!showPasswordChangeModal);
    router.push(`${paths.web.profile}?change-password=true`);
  };

  const handleCloseShowModal = () => {
    setShowPasswordChangeModal(false);
    router.push(`${paths.web.profile}`);
  };

  return (
    <>
      <ChangePasswordModal
        open={showPasswordChangeModal}
        onClose={handleCloseShowModal}
        key={`someBoredKey`}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <List>
              <ListItem sx={{ p: 3 }}>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Cambiar contraseña"
                  secondary="Se recomienda fijar una contraseña segura."
                />
                <Button
                  size="large"
                  variant="outlined"
                  onClick={handleChangeShowModal}
                >
                  Cambiar contraseña
                </Button>
              </ListItem>
              <Divider component="li" />
              <ListItem sx={{ p: 3 }}>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary="Autenticación de dos factores"
                  secondary="Enviar PIN de verifición al correo electrónico."
                />
                <Switch
                  color="primary"
                  checked={settings?.authMfa}
                  onChange={(event) => handleChange(event, 'authMfa')}
                  disabled={isLoading}
                />
                {isLoading && <CircularProgress size={24} />}
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              subheaderTypographyProps={{}}
              titleTypographyProps={{}}
              title="Inicios de sesión"
              subheader="Actividad reciente de la cuenta"
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Navegador</TableCell>
                    <TableCell>Versión</TableCell>
                    <TableCell>Plataforma</TableCell>
                    <TableCell>SO</TableCell>
                    <TableCell>Dirección IP</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Ocurrencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress sx={{ my: 4 }} size={48} />
                      </TableCell>
                    </TableRow>
                  ) : loginData.length > 0 ? (
                    loginData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((loginRecord) => (
                        <TableRow key={loginRecord.id} hover>
                          <TableCell>
                            {`${loginRecord.userAgent.browser || `N/A`}`}
                          </TableCell>
                          <TableCell>{`${
                            loginRecord.userAgent.version || `N/A`
                          }`}</TableCell>
                          <TableCell>{`${
                            loginRecord.userAgent.platform || `N/A`
                          }`}</TableCell>
                          <TableCell>{`${
                            loginRecord.userAgent.os || `N/A`
                          }`}</TableCell>
                          <TableCell>{`${loginRecord.ip || `N/A`}`}</TableCell>
                          <TableCell>{`${
                            loginRecord.location || `N/A`
                          }`}</TableCell>
                          <TableCell>{`${
                            loginRecord.createdAt || `N/A`
                          }`}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ my: 4 }}>
                          ¡Parece que nunca has iniciado sesión!
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={loginData ? loginData.length : 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Registros por página"
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default protect(SecurityTab);
