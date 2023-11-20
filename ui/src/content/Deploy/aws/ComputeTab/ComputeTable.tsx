import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { useState, useEffect, FC } from 'react';

import Label from '../../../../components/Label';
import { customAxios } from '../../../../helper/customAxios';
import moment from 'moment';
import paths from '../../../../helper/paths';

interface NodeInterface {
  data: {
    uuid: string;
    name: string;
    state: string;
    extra: {
      availability: string;
      image_id: string;
      instance_type: string;
    };
    public_ips: string[];
    instance_type: string;
    created_at: string;
  }[];
}

const ComputeNodesTable: FC<{ showModal: boolean }> = ({ showModal }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleRequest = async () => {
      if (!showModal) {
        setIsLoading(true);
        const response = await customAxios.get<NodeInterface[]>(
          paths.api.compute.node
        );
        setIsLoading(false);
        setData(response.data);
      }
    };
    handleRequest();
  }, [showModal]);

  const handleChangePage = (_event: any | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          subheaderTypographyProps={{}}
          titleTypographyProps={{}}
          title="Nodos de cómputo"
          subheader="Instancias deplegadas en EC2"
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Dirección IP</TableCell>
                <TableCell>Tamaño</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Disponibilidad</TableCell>
                <TableCell>Fecha de creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress sx={{ my: 6 }} size={48} />
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data
                  .sort(
                    (a, b) =>
                      moment(b.created_at).unix() - moment(a.created_at).unix()
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.uuid} hover>
                      <TableCell>{`${item.name || `N/A`}`}</TableCell>
                      <TableCell>
                        {item.state === 'running' ? (
                          <Label color="success">
                            <b>En ejecución</b>
                          </Label>
                        ) : (
                          <Label color="black">{item.state || `N/A`}</Label>
                        )}
                      </TableCell>
                      <TableCell>{`${
                        item.public_ips.lenght > 0 ? item.public_ips : `N/A`
                      }`}</TableCell>
                      <TableCell>{`${
                        item.extra.instance_type || `N/A`
                      }`}</TableCell>
                      <TableCell>{`${item.extra.image_id || `N/A`}`}</TableCell>
                      <TableCell>{`${
                        item.extra.availability || `N/A`
                      }`}</TableCell>
                      <TableCell>{`${
                        moment(item.created_at).format(`YYYY-MM-DD hh:mm A`) ||
                        `N/A`
                      }`}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ my: 4 }}>
                      Sin instancias, ¿Has pensado en desplegar una?
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
            count={data ? data.length : 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Registros por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default ComputeNodesTable;
