import {
  Card,
  Box,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  LinearProgress,
  styled
} from '@mui/material';
import { BiWorld } from 'react-icons/bi';
import { BiMap } from 'react-icons/bi';

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

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        margin-right: ${theme.spacing(1)};
        height: 10px;
        background-color: ${theme.colors.error.main};

        .MuiLinearProgress-barColorPrimary {
          background-color: ${theme.colors.alpha.white[100]};
          border-top-right-radius: ${theme.general.borderRadius};
          border-bottom-right-radius: ${theme.general.borderRadius};
        }
`
);

function Locations() {
  const theme = useTheme();

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
          color: `${theme.colors.alpha.white}`
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
            <Typography variant="h1">23</Typography>
            <TypographySecondary
              sx={{
                color: `${theme.colors.alpha.white}`
              }}
              variant="subtitle2"
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
            <Typography variant="h1">5</Typography>
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
