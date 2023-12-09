import { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme
} from '@mui/material';
import Label from 'src/components/Label';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {
  CryptoOrder,
  CryptoOrderStatus
} from '../../../src/types/user-table.type';
import { customAxios } from '../../../src/helper/customAxios';
import paths from '../../../src/helper/paths';
import { HttpStatusCode } from 'axios';
import { useSnackbar } from '../../../src/contexts/SnackbarContext';

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: CryptoOrder[];
}

interface Filters {
  status?: CryptoOrderStatus;
}

const getStatusLabel = (active: boolean): JSX.Element => {
  const map = {
    failed: {
      text: 'Inactivo',
      color: 'secondary'
    },
    completed: {
      text: 'Activo',
      color: 'success'
    }
  };

  const { text, color }: any = active ? map['completed'] : map['failed'];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  cryptoOrders: CryptoOrder[],
  filters: Filters
): CryptoOrder[] => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: CryptoOrder[],
  page: number,
  limit: number
): CryptoOrder[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const UsersTable: FC<RecentOrdersTableProps> = ({ cryptoOrders }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [users, setUsers] = useState([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const getUsers = async () => {
      const users = await customAxios.get(paths.api.user.management);
      if (users.status === HttpStatusCode.Ok) setUsers(users.data);
    };
    getUsers();
  }, []);

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Pais</TableCell>
              <TableCell>Inicios</TableCell>
              <TableCell>Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => {
                return (
                  <TableRow hover key={user.id}>
                    <TableCell>
                      <Typography
                        color="text.primary"
                        fontSize={`${theme.typography.pxToRem(16)}`}
                        fontWeight={600}
                        gutterBottom
                        noWrap
                      >
                        {user.firstName} {user.secondName} {user.firstLastName}{' '}
                        {user.secondLastName}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontWeight: 400 }}
                        noWrap
                      >
                        {user.id}
                      </Typography>
                      <Box
                        sx={{
                          gap: 1,
                          display: `flex`,
                          alignItems: `center`,
                          my: 1
                        }}
                      >
                        {user.isEmailVerified ? (
                          <CheckCircleOutlineIcon
                            fontSize="small"
                            color="success"
                          />
                        ) : (
                          <WarningAmberIcon fontSize="small" color="warning" />
                        )}
                        <Typography sx={{ fontWeight: 400 }} noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusLabel(user.active)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.role.label}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.country}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.loginCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {user.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Copiar información" arrow>
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(`${user.email}`);
                            showSnackbar(
                              `Información copiada al portapapeles`,
                              `success`
                            );
                          }}
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={users ? users.length : 0}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPage={limit}
          labelRowsPerPage="Registros por página"
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    </Card>
  );
};

UsersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

UsersTable.defaultProps = {
  cryptoOrders: []
};

export default UsersTable;
