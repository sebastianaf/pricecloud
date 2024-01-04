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
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { BiShowAlt } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';

import Text from 'src/components/Text';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';
import { HttpStatusCode } from 'axios';
import numeral from 'numeral';
import { GetIcon } from '../../../helper/GetIcon';
import { useModal } from '../../../contexts/ModalContext';
import { generateColor } from '../../../helper/generateColor';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);
const periods = [
  { value: 'productHash', text: `Hash de producto` }
  //To improve performance, the following options are disabled
  /* { value: 'productFamily', text: `Familia de producto` },
  { value: 'vendorName', text: `Vendedor` },
  { value: 'service', text: `Servicio` },
  { value: 'region', text: `Región` } */
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
    productName?: string;
    description?: string;
    servicename?: string;
    instanceType?: string;
  };
  prices: Object;
}

function PriceCards() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const actionRef1 = useRef<any>(null);
  const actionRef2 = useRef<any>(null);
  const [period, setPeriod] = useState<string>(periods[0].value);
  const [period2, setPeriod2] = useState<string>(periods2[0].value);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [openPeriod2, setOpenMenuPeriod2] = useState<boolean>(false);
  const [priceData, setPriceData] =
    useState<[PriceListInterface[], number]>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const { isModalOpen, openModal, closeModal, setModalData } = useModal();
  const [filter, setFilter] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleRequest = async () => {
      setLoading(true);
      try {
        const response = await customAxios.get<[PriceListInterface[], number]>(
          `${paths.api.price.findProductPrice}?offset=${
            page * rowsPerPage
          }&limit=${rowsPerPage}&sortBy=${period}&sortOrder=${period2}&filter=${filter}`
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
  }, [rowsPerPage, page, period, period2, filter]);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = (event: any) => {
    setFilter(searchValue);
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

  const handleKeyDownEnter = (event: any) => {
    if (event.key === 'Enter') {
      handleFilter(event);
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
                    Object.keys(item.attributes).map((key, index) => {
                      return (
                        <li>
                          {key}: {item.attributes[key]}
                        </li>
                      );
                    })}{' '}
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
          placeholder="Buscar un producto..."
          value={searchValue}
          onChange={(event: any) => {
            setSearchValue(event.target.value);
          }}
          onKeyDown={handleKeyDownEnter}
          endAdornment={
            <InputAdornment position="end">
              <Button
                disabled={loading}
                variant="contained"
                size="small"
                onClick={handleFilter}
              >
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
        alignContent="center"
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
          alignContent="center"
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
            {periods.find((_period) => _period.value === period).text}
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
                  setPeriod(_period.value);
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
            {periods2.find((_period) => _period.value === period2).text}
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
                  setPeriod2(_period.value);
                  setOpenMenuPeriod2(false);
                }}
              >
                {_period.text}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>

      {loading || !priceData ? (
        <Grid
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="415px"
          flex={1}
        >
          <CircularProgress size={64} />
        </Grid>
      ) : (
        <Grid
          container
          spacing={2}
          alignContent={`flex-start`}
          justifyContent={`flex-start`}
        >
          {priceData[0].map((item) => (
            <Grid item xs={12} sm={6} lg={4}>
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
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1
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
                    <GetIcon tag={item.vendorName} size={24} />
                    {item.region ?? 'global'}
                  </Typography>
                  <Chip
                    size="small"
                    label={item.productFamily || 'Sin categoría'}
                    variant="outlined"
                    sx={{
                      color: generateColor(item.productFamily),
                      borderColor: generateColor(item.productFamily)
                    }}
                  />
                </CardContent>
                <Divider sx={{ my: 1 }} />
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
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography fontWeight={400} fontSize={20} marginTop={1}>
                      {item.service}
                    </Typography>
                  </Box>

                  {/* <Rating value={4} defaultValue={5} precision={1} readOnly /> */}

                  <Typography variant="subtitle1">
                    {item?.attributes?.description ??
                      item?.attributes?.productName ??
                      item?.attributes?.servicename ??
                      item?.attributes?.instanceType ??
                      'Sin descripción'}
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ gap: 1 }}
                    onClick={() => handleDetails(item)}
                  >
                    Ver más
                    <IoIosArrowDown size={24} />
                  </Button>
                </CardContent>
                <Divider sx={{ mt: 2, mb: 1 }} />
                <CardActions
                  sx={{
                    display: 'flex',
                    alignContent: 'baseline',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    size="small"
                    variant="text"
                    sx={{ gap: 1 }}
                    onClick={() => {
                      handlePrice(item);
                    }}
                  >
                    <BiShowAlt size={24} />
                    {` `}
                    Ver información de precios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
