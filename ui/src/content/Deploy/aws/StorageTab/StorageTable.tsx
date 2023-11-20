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

import { customAxios } from '../../../../helper/customAxios';
import moment from 'moment';
import paths from '../../../../helper/paths';

interface ContainerInterface {
  data: {
    name: string;
    extra: {
      creation_date: string;
    };
  }[];
}

const ComputeTable: FC<{ showModal: boolean }> = ({ showModal }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleRequest = async () => {
      if (!showModal) {
        setIsLoading(true);
        const response = await customAxios.get<ContainerInterface[]>(
          paths.api.storage.root
        );
        console.log(response.data[0]);

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
          title="Buckets"
          subheader="Contenedores de objetos de S3"
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha de creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress sx={{ my: 6 }} size={48} />
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data
                  .sort(
                    (a, b) =>
                      moment(b.extra.creation_date).unix() -
                      moment(a.extra.creation_date).unix()
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={`${item.name}${new Date()}`} hover>
                      <TableCell>{`${item.name || `N/A`}`}</TableCell>
                      <TableCell>{`${
                        moment(item.extra.creation_date).format(
                          `YYYY-MM-DD hh:mm A`
                        ) || `N/A`
                      }`}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ my: 4 }}>
                      Sin buckets, ¿Has pensado en crear uno?
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
            count={0}
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

export default ComputeTable;
