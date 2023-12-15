import {
  Card,
  Box,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  styled
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BiWorld } from 'react-icons/bi';
import { BiMap } from 'react-icons/bi';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';

const RootWrapper = styled(Card)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black2};
    color: ${theme.colors.alpha.white[100]};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.palette.error.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white};
`
);

function Locations() {
  const theme = useTheme();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const handlerRequest = async () => {
      const response = await customAxios.get(
        paths.api.price.countVendorProducts
      );
      setData(response?.data);
    };
    handlerRequest();
  }, []);

  return (
    <RootWrapper
      sx={{
        p: 2
      }}
    >
      <Typography
        variant="h3"
        sx={{
          px: 2,
          pb: 1,
          pt: 2,
          fontSize: `${theme.typography.pxToRem(23)}`,
          color: `${theme.colors.alpha.white[40]}`
        }}
      >
        Ubicaciones
      </Typography>
      <CardContent>
        <Box
          display="flex"
          sx={{
            px: 2,
            pb: 3
          }}
          alignItems="center"
        >
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
                color: `${theme.colors.alpha.trueWhite[100]}`
              }}
            >
              23
            </Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              Regiones
            </TypographySecondary>
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            px: 2,
            pb: 3
          }}
          alignItems="center"
        >
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
                color: `${theme.colors.alpha.trueWhite[100]}`
              }}
            >
              5
            </Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              Continentes
            </TypographySecondary>
          </Box>
        </Box>
        {/* <Box pt={3}>
          <LinearProgressWrapper
            value={76}
            color="primary"
            variant="determinate"
          />
        </Box> */}
      </CardContent>
    </RootWrapper>
  );
}

export default Locations;
