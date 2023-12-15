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
          py: 2,
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
                color: `${theme.colors.primary.main}`
              }}
            >
              23
            </Typography>
            <TypographySecondary
              color={`lightsteelblue`}
              variant="caption"
              noWrap
            >
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
        </Box>
      </CardContent>
    </RootWrapper>
  );
}

export default Locations;
