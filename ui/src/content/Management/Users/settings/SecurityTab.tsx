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

import { format, subHours, subWeeks, subDays } from 'date-fns';
import { useAuth } from '../../../../contexts/AuthContext';

function SecurityTab() {
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { loginData, getLoginData } = useAuth();
  useEffect(() => {
    const handleGetLoginData = async () => await getLoginData();
    handleGetLoginData();
  }, []);

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

  return (
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
              <Button size="large" variant="outlined">
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
              <Switch color="primary" />
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
                  loginData.map((loginRecord) => (
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
                      <TableCell>{`${loginRecord.event || `N/A`}`}</TableCell>
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
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SecurityTab;
