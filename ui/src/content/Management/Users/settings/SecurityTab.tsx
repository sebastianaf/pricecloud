import { useState, MouseEvent, ChangeEvent } from 'react';
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
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme
} from '@mui/material';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format, subHours, subWeeks, subDays } from 'date-fns';

function SecurityTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const logs = [
    {
      id: 1,
      browser: ' Safari/537.36',
      ipaddress: '3.70.73.142',
      location: 'Estados Unidos',
      date: subDays(new Date(), 2).getTime()
    },
    {
      id: 2,
      browser: 'Chrome/36.0.1985.67',
      ipaddress: '138.13.136.179',
      location: 'China',
      date: subDays(new Date(), 6).getTime()
    },
    {
      id: 3,
      browser: 'Googlebot/2.1',
      ipaddress: '119.229.170.253',
      location: 'China',
      date: subHours(new Date(), 15).getTime()
    },
    {
      id: 4,
      browser: 'AppleWebKit/535.1',
      ipaddress: '206.8.99.49',
      location: 'Filipinas',
      date: subDays(new Date(), 4).getTime()
    },
    {
      id: 5,
      browser: 'Mozilla/5.0',
      ipaddress: '235.40.59.85',
      location: 'China',
      date: subWeeks(new Date(), 3).getTime()
    }
  ];

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
                  <TableCell>Dirección IP</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Fecha/Hora</TableCell>
                  <TableCell>Evento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.browser}</TableCell>
                    <TableCell>{log.ipaddress}</TableCell>
                    <TableCell>{log.location}</TableCell>
                    <TableCell>
                      {format(log.date, 'dd MMMM, yyyy - h:mm:ss a')}
                    </TableCell>
                    <TableCell>Inicio de sesión</TableCell>
                  </TableRow>
                ))}
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
