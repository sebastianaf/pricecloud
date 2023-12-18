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
  TablePagination
} from '@mui/material';
import { formatDistance, subDays } from 'date-fns';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Text from 'src/components/Text';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';
import { HttpStatusCode } from 'axios';
import numeral from 'numeral';
import { GetIcon } from '../../../helper/GetIcon';

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
  attributes: Object;
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
      <Box
        py={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
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
        </Box>
        <Box display="flex" alignItems="center">
          <Typography
            variant="subtitle2"
            sx={{
              pr: 1
            }}
          >
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
        </Box>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ display: `flex`, alignItems: `center`, justifyContent: `center` }}
      >
        {loading || !priceData ? (
          <Box
            sx={{
              display: `flex`,
              justifyItems: `center`,
              alignItems: `center`,
              minHeight: `440px`,
              alignSelf: `center`
            }}
          >
            <CircularProgress size={72} />
          </Box>
        ) : (
          priceData[0].map((item) => (
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: `${theme.colors.alpha.black[5]}`
                }}
              >
                <Box>
                  <GetIcon tag={item.vendorName} />
                </Box>
                <Box>
                  <Rating value={4} defaultValue={5} precision={1} readOnly />
                </Box>
                <Typography variant="h3" sx={{ my: 2, minHeight: 80 }}>
                  {item.service}
                </Typography>
                <Box
                  sx={{
                    py: 2
                  }}
                >
                  <Chip
                    sx={{
                      mr: 0.5
                    }}
                    size="small"
                    label={item.productFamily}
                    color="info"
                    variant="outlined"
                  />
                </Box>
                {
                  <Typography
                    sx={{
                      pb: 2
                    }}
                    color="text.secondary"
                  >
                    {item.prices &&
                      Object.keys(item.prices).map((key) => (
                        <ul>
                          <li>
                            {key}: {JSON.stringify(item.prices[key])}
                          </li>
                        </ul>
                      ))}
                  </Typography>
                }
                {
                  <Typography
                    sx={{
                      pb: 2
                    }}
                    color="text.secondary"
                  >
                    {JSON.stringify(item.attributes)}
                  </Typography>
                }
                <Divider
                  sx={{
                    my: 2
                  }}
                />
                <CardActions
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography
                    display="flex"
                    alignItems="center"
                    variant="subtitle2"
                  >
                    <TodayTwoToneIcon
                      sx={{
                        mr: 1
                      }}
                    />
                    {formatDistance(subDays(new Date(), 24), new Date(), {
                      addSuffix: true
                    })}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Box
        sx={{
          pt: 4
        }}
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
