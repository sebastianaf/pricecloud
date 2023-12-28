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
    background: ${theme.colors.gradients.black2};
    color: ${theme.colors.alpha.white[100]};
    padding: ${theme.spacing(2)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      color: ${theme.palette.text.primary};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      color: ${theme.palette.text.primary};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white};
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
              color: `${theme.colors.alpha.white[40]}`
            }}
          >
            Ubicaciones
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={12} display="flex">
          <AvatarSuccess
            sx={{
              mr: 2
            }}
            variant="rounded"
          >
            <BiMap size={96} />
          </AvatarSuccess>
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: `${theme.colors.primary.main}`
              }}
            >
              {countRegions}
            </Typography>
            <TypographySecondary
              color={`lightsteelblue`}
              variant="caption"
              noWrap
            >
              Regiones
            </TypographySecondary>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={12} display="flex">
          <AvatarError
            sx={{
              mr: 2
            }}
            variant="rounded"
          >
            <BiWorld size={96} />
          </AvatarError>
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: `${theme.colors.primary.main}`
              }}
            >
              5
            </Typography>
            <TypographySecondary
              variant="caption"
              color={`lightsteelblue`}
              noWrap
            >
              Continentes
            </TypographySecondary>
          </Box>
        </Grid>
      </Grid>
    </RootWrapper>
  );
}

export default Locations;
