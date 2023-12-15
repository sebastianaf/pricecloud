import {
  Box,
  Grid,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  LinearProgress,
  styled
} from '@mui/material';
import { formatDistance, subDays, subMinutes, subHours } from 'date-fns';
import Text from 'src/components/Text';
import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure } from 'react-icons/si';
import { SiGooglecloud } from 'react-icons/si';

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
    border: ${theme.colors.alpha.white[100]} solid 2px;
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        height: 10px;
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }
`
);

function TeamOverview() {
  const theme = useTheme();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Box>
          <Box display="flex" alignItems="center" justifyItems="center">
            <FaAws color={`info`} size={72} />
            <Box
              sx={{
                ml: 1.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Amazon Web Services
              </Typography>
              <Typography variant="h1" color={`primary`} noWrap>
                1.37M
              </Typography>
              <Typography variant="caption" color={`info`} noWrap>
                precios
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
                ml: 1.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Google Cloud Platform
              </Typography>
              <Typography variant="h1" color={`primary`} noWrap>
                432K
              </Typography>
              <Typography variant="caption" color={`info`} noWrap>
                precios
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
                ml: 1.5
              }}
            >
              <Typography variant="h4" noWrap gutterBottom>
                Microsoft Azure
              </Typography>
              <Typography variant="h1" color={`primary`} noWrap>
                70K
              </Typography>
              <Typography variant="caption" color={`info`} noWrap>
                precios
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default TeamOverview;
