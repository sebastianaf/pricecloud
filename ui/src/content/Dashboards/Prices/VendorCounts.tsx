import {
  Box,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import numeral from 'numeral';

import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure } from 'react-icons/si';
import { SiGooglecloud } from 'react-icons/si';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';
import { VendorNameType } from '../../../types/vendor-name.type';

function VendorCounts() {
  const theme = useTheme();
  const [data, setData] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  useEffect(() => {
    const handlerRequest = async () => {
      const response = await customAxios.get(
        paths.api.price.countVendorProducts
      );
      setData(response?.data);

      const response2 = await customAxios.get(paths.api.price.productFamilies);
      setData2(response2?.data);
    };
    handlerRequest();
  }, []);

  return (
    <Grid
      display="flex"
      flexDirection="row"
      alignItems="flex-start  "
      justifyItems="center"
      container
      spacing={4}
    >
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="flex-start" justifyItems="center">
            <FaAws color={`info`} size={72} />
            <Box
              sx={{
                ml: 2.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Amazon Web Services
              </Typography>
              <Typography variant="h1" color={`primary`} noWrap>
                {data && Array.isArray(data) ? (
                  numeral(
                    Number(
                      data.find(
                        (item) => item.vendorName === VendorNameType.aws
                      )?.productCount || 0
                    )
                  )
                    .format('0.0a')
                    .toUpperCase()
                ) : (
                  <CircularProgress size={32} />
                )}
              </Typography>
              <Typography variant="caption" color={`info`} noWrap>
                precios
              </Typography>
              <Typography
                variant="subtitle1"
                color={`lightsteelblue`}
                noWrap
                sx={{ mt: 1 }}
              >
                {data2 ? (
                  <>
                    {numeral(
                      Number(data2[`${VendorNameType.aws}`]?.length || 0)
                    )
                      .format('0')
                      .toUpperCase()}{' '}
                    categorias de productos
                  </>
                ) : (
                  <LinearProgress variant="query" />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="center" pb={3}>
            <SiGooglecloud size={72} />

            <Box
              sx={{
                ml: 2.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Google Cloud Platform
              </Typography>
              <Typography variant="h1" color={`primary`} noWrap>
                {data && Array.isArray(data) ? (
                  numeral(
                    Number(
                      data.find(
                        (item) => item.vendorName === VendorNameType.gcp
                      )?.productCount || 0
                    )
                  )
                    .format('0.0a')
                    .toUpperCase()
                ) : (
                  <CircularProgress size={32} />
                )}
              </Typography>
              <Typography variant="caption" color={`info`} noWrap>
                precios
              </Typography>
              <Typography
                variant="subtitle1"
                color={`lightsteelblue`}
                noWrap
                sx={{ mt: 1 }}
              >
                {data2 ? (
                  <>
                    {numeral(
                      Number(data2[`${VendorNameType.gcp}`]?.length || 0)
                    )
                      .format('0')
                      .toUpperCase()}{' '}
                    categorias de productos
                  </>
                ) : (
                  <LinearProgress variant="query" />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="center" pb={3}>
            <SiMicrosoftazure size={72} />
            <Box
              sx={{
                ml: 2.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Microsoft Azure
              </Typography>
              <Typography variant="h1" color={`primary`} noWrap>
                {data ? (
                  numeral(
                    Number(
                      data.find(
                        (item) => item.vendorName === VendorNameType.azure
                      )?.productCount || 0
                    )
                  )
                    .format('0')
                    .toUpperCase()
                ) : (
                  <CircularProgress size={32} />
                )}
              </Typography>
              <Typography variant="caption" color={`info`} noWrap>
                precios
              </Typography>
              <Typography
                variant="subtitle1"
                color={`lightsteelblue`}
                noWrap
                sx={{ mt: 1 }}
              >
                {data2 ? (
                  <>
                    {numeral(
                      Number(data2[`${VendorNameType.azure}`]?.length || 0)
                    )
                      .format('0')
                      .toUpperCase()}{' '}
                    categorias de productos
                  </>
                ) : (
                  <LinearProgress variant="query" />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default VendorCounts;
