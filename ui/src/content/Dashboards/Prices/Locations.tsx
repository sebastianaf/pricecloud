import {
  Card,
  Box,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  styled,
  CircularProgress,
  Grid
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BiWorld } from 'react-icons/bi';
import { BiMap } from 'react-icons/bi';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';
import { HttpStatusCode } from 'axios';

const RootWrapper = styled(Card)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
`
);

// Antes eran dos definiciones identicas llamadas AvatarSuccess y AvatarError;
// ni una era de exito ni la otra de error, solo iconos de ubicacion.
const AvatarLocation = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.palette.text.secondary};
`
);

function Locations() {
  const theme = useTheme();
  const [countRegions, setCountRegions] = useState<any>(null);

  useEffect(() => {
    const handlerRequest = async () => {
      const response = await customAxios.get(paths.api.price.countRegions);
      if (response.status === HttpStatusCode.Ok) {
        setCountRegions(response?.data?.length);
      }
    };
    handlerRequest();
  }, []);

  return !countRegions ? (
    <Box
      sx={{
        p: 4,
        display: `flex`,
        justifyContent: `center`,
        minHeight: 'auto'
      }}
    >
      <CircularProgress size={32} />
    </Box>
  ) : (
    <RootWrapper>
      <Grid container display="flex" flexDirection="row" spacing={2} pb={4}>
        <Grid item xs={12} paddingBottom={2}>
          <Typography
            variant="h3"
            sx={{
              fontSize: `${theme.typography.pxToRem(23)}`,
              color: `${theme.palette.text.secondary}`
            }}
          >
            Ubicaciones
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={12} display="flex">
          <AvatarLocation
            sx={{
              mr: 2
            }}
            variant="rounded"
          >
            <BiMap size={96} />
          </AvatarLocation>
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: `${theme.colors.primary.main}`
              }}
            >
              {countRegions}
            </Typography>
            <TypographySecondary variant="caption" noWrap>
              Regiones
            </TypographySecondary>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={12} display="flex">
          <AvatarLocation
            sx={{
              mr: 2
            }}
            variant="rounded"
          >
            <BiWorld size={96} />
          </AvatarLocation>
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: `${theme.colors.primary.main}`
              }}
            >
              5
            </Typography>
            <TypographySecondary variant="caption" noWrap>
              Continentes
            </TypographySecondary>
          </Box>
        </Grid>
      </Grid>
    </RootWrapper>
  );
}

export default Locations;
