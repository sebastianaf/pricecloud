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
  CircularProgress
} from '@mui/material';

import { useAuth } from '../../../../contexts/AuthContext';
import { protect } from '../../../../helper/protect';
import { customAxios } from '../../../../helper/customAxios';
import paths from '../../../../helper/paths';
import ChangePasswordModal from '../../../../components/ChangePasswordModal';
import { useRouter } from 'next/router';

type AuthType = 'mfa';

export interface AuthStatus {
  mfa: boolean;
}

function SecurityTab() {
  const [authData, setAuthData] = useState({
    mfa: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { loginData, getLoginData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleGetLoginData = async () => await getLoginData();
    handleGetLoginData();
    getAuthData();
  }, []);

  const getAuthData = async () => {
    try {
      setIsLoading(true);
      const response = await customAxios.get<AuthStatus>(paths.api.auth.status);

      setAuthData(response.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const updateAuth = async (authStatusType: AuthType, active: boolean) => {
    try {
      await customAxios.put(paths.api.auth.status, {
        authStatusType,
        active
      });
    } catch (error) {}
  };

  const handleChange = async (
    event: ChangeEvent<HTMLInputElement>,
    authType: AuthType
  ) => {
    const { checked } = event.target;
    setAuthData((prevData) => ({
      ...prevData,
      [authType]: checked
    }));

    await updateAuth(authType, checked);
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
                  checked={authData?.mfa}
                  onChange={(event) => handleChange(event, 'mfa')}
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
                    <TableCell>OS</TableCell>
                    <TableCell>Dirección IP</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Ocurrencia</TableCell>
                    <TableCell>Evento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loginData ? (
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
                          <TableCell>{`${
                            loginRecord.event || `N/A`
                          }`}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <CircularProgress />
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
