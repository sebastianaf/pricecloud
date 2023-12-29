import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Grid,
  Box,
  FormControl,
  CardActions,
  Typography,
  Divider,
  Rating,
  OutlinedInput,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  useTheme,
  CircularProgress,
  TablePagination,
  CardContent
} from '@mui/material';
import { formatDistance, subDays } from 'date-fns';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { BiWorld } from 'react-icons/bi';

import Text from 'src/components/Text';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';
import { HttpStatusCode } from 'axios';
import numeral from 'numeral';
import { GetIcon } from '../../../helper/GetIcon';
import Modal from '../../../components/Modal';
import { useModal } from '../../../contexts/ModalContext';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);
const periods = [
  { value: 'productFamily', text: `Familia de producto` },
  { value: 'vendorName', text: `Vendedor` },
  { value: 'service', text: `Servicio` },
  { value: 'region', text: `Región` },
  { value: 'price', text: `Precio` }
];

const periods2 = [
  { value: 'ASC', text: `Ascendente` },
  { value: 'DESC', text: `Descendente` }
];

interface PriceListInterface {
  productHash: string;
  sku: string;
  vendorName: string;
  region: string;
  service: string;
  productFamily: string;
  attributes: {
    description?: string;
  };
  prices: Object;
}

function PriceCards() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const actionRef1 = useRef<any>(null);
  const actionRef2 = useRef<any>(null);
  const [period, setPeriod] = useState<string>(periods[0].text);
  const [period2, setPeriod2] = useState<string>(periods2[0].text);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [openPeriod2, setOpenMenuPeriod2] = useState<boolean>(false);
  const [priceData, setPriceData] =
    useState<[PriceListInterface[], number]>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const { isModalOpen, openModal, closeModal, setModalData } = useModal();

  useEffect(() => {
    const handleRequest = async () => {
      setLoading(true);
      try {
        const response = await customAxios.get<[PriceListInterface[], number]>(
          `${paths.api.price.findProductPrice}?offset=${
            page * rowsPerPage
          }&limit=${rowsPerPage}`
        );
        if (response.status === HttpStatusCode.Ok) {
          setPriceData(response.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    handleRequest();
  }, [rowsPerPage, page, period, period2]);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePrice = (item: PriceListInterface) => {
    if (isModalOpen) closeModal();
    else {
      setModalData({
        title: `Precios del producto`,
        buttonText: 'Cerrar',
        message: (
          <>
            <Typography variant="subtitle2">
              <Text color="black">
                {item.prices &&
                  Object.keys(item.prices).map((key, index) => (
                    <>
                      <div>
                        <Text color="black">Precio #{index + 1}:</Text>
                      </div>
                      <ul>
                        {item.prices[key] &&
                          item.prices[key].map((price2) =>
                            Object.keys(price2).map((key2) => (
                              <li>
                                <Typography variant="subtitle2">
                                  <Text color="black">
                                    <b>
                                      {key2}:{`${` `}`}
                                    </b>
                                    {price2[key2]}
                                  </Text>
                                </Typography>
                              </li>
                            ))
                          )}
                      </ul>
                    </>
                  ))}
              </Text>
            </Typography>
          </>
        )
      });
      openModal();
    }
  };

  const handleDetails = (item: PriceListInterface) => {
    if (isModalOpen) closeModal();
    else {
      setModalData({
        title: `Detalles del producto`,
        buttonText: 'Cerrar',
        message: (
          <>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>SKU:</b> {item.sku}
              </Text>
            </Typography>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>Proveedor:</b> {item.vendorName}
              </Text>
            </Typography>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>Región:</b> {item.region}
              </Text>
            </Typography>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>Servicio:</b> {item.service}
              </Text>
            </Typography>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>Familia de producto:</b> {item.productFamily}
              </Text>
            </Typography>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>Descripción:</b>{' '}
                {item?.attributes?.description ?? 'Sin descripción'}
              </Text>
            </Typography>
            <Typography variant="subtitle2">
              <Text color="black">
                <b>Detalles:</b>
                <ul>
                  {item.attributes &&
                    Object.keys(item.attributes).map((key, index) => (
                      <li>
                        {key}: {item.attributes[key]}
                      </li>
                    ))}
                </ul>
              </Text>
            </Typography>
          </>
        )
      });
      openModal();
    }
  };

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInputWrapper
          type="text"
          placeholder="¿Qué estás buscando?"
          endAdornment={
            <InputAdornment position="end">
              <Button variant="contained" size="small">
                Buscar
              </Button>
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <Grid
        container
        display="flex"
        flexDirection="row"
        alignItems="center"
        rowGap={2}
        py={3}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            <Text color="black">
              Productos encontrados:{' '}
              <b>
                {priceData
                  ? numeral(priceData[1]).format(`0.0a`).toUpperCase()
                  : `Ninguno`}
              </b>
            </Text>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          flexWrap={`wrap`}
          gap={1}
        >
          <Typography variant="subtitle2" paddingRight={1}>
            Ordenar por:
          </Typography>
          <Button
            size="small"
            variant="outlined"
            ref={actionRef1}
            onClick={() => setOpenMenuPeriod(true)}
            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
          >
            {period}
          </Button>
          <Menu
            disableScrollLock
            anchorEl={actionRef1.current}
            onClose={() => setOpenMenuPeriod(false)}
            open={openPeriod}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            {periods.map((_period) => (
              <MenuItem
                key={_period.value}
                onClick={() => {
                  setPeriod(_period.text);
                  setOpenMenuPeriod(false);
                }}
              >
                {_period.text}
              </MenuItem>
            ))}
          </Menu>
          <Button
            size="small"
            variant="outlined"
            ref={actionRef2}
            onClick={() => setOpenMenuPeriod2(true)}
            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
          >
            {period2}
          </Button>
          <Menu
            disableScrollLock
            anchorEl={actionRef2.current}
            onClose={() => setOpenMenuPeriod2(false)}
            open={openPeriod2}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            {periods2.map((_period) => (
              <MenuItem
                key={_period.value}
                onClick={() => {
                  setPeriod2(_period.text);
                  setOpenMenuPeriod2(false);
                }}
              >
                {_period.text}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems={`flex-start`}
        justifyContent={`center`}
      >
        {loading || !priceData ? (
          <Grid
            item
            display="flex"
            justifyItems="center"
            alignItems="center"
            minHeight="435px"
            alignSelf="center"
          >
            <CircularProgress size={72} />
          </Grid>
        ) : (
          priceData[0].map((item) => (
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: `${theme.colors.alpha.black[5]}`,
                  minHeight: 415,
                  maxHeight: 415,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent
                  sx={{
                    display: `flex`,
                    flexDirection: `column`,
                    justifyContent: `space-between`,
                    padding: 0,
                    flex: 1,
                    overflow: 'auto'
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={2}
                  >
                    <Box minWidth={48}>
                      <GetIcon tag={item.vendorName} />
                    </Box>
                    <Typography fontSize={22}>{item.service}</Typography>
                  </Box>

                  {/* <Rating value={4} defaultValue={5} precision={1} readOnly /> */}
                  <Box>
                    <Chip
                      size="small"
                      label={item.productFamily}
                      color="info"
                      variant="outlined"
                    />
                  </Box>

                  {item?.attributes?.description ?? 'Sin descripción'}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDetails(item)}
                  >
                    Ver más
                  </Button>
                </CardContent>
                <Divider sx={{ mt: 4 }} />
                <CardActions
                  sx={{
                    display: 'flex',
                    alignContent: 'baseline',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontSize={16}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1}
                  >
                    <BiWorld size={20} />
                    {item.region}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      handlePrice(item);
                    }}
                  >
                    Ver precios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Box
        paddingTop={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <TablePagination
          component="div"
          count={priceData ? priceData[1] : 0}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Registros por página"
          rowsPerPageOptions={[3, 6, 12, 15]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${
              priceData ? numeral(priceData[1]).format(`0.0a`).toUpperCase() : 0
            }`
          }
        />
      </Box>
    </>
  );
}

export default PriceCards;
