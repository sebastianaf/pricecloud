import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Box,
  Menu,
  alpha,
  MenuItem,
  Typography,
  styled,
  useTheme,
  CircularProgress
} from '@mui/material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { Chart } from 'src/components/Chart';
import type { ApexOptions } from 'apexcharts';
import { customAxios } from '../../../helper/customAxios';
import paths from '../../../helper/paths';
import { HttpStatusCode } from 'axios';

const DotPrimary = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

const periods = [
  {
    value: 'aws',
    text: 'Amazon Web Services'
  },
  {
    value: 'gcp',
    text: 'Google Cloud Platform'
  },
  {
    value: 'azure',
    text: 'Microsoft Azure'
  }
];

function Geography() {
  const theme = useTheme();
  const [labels, setLabels] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const actionRef1 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>(periods[0].text);

  useEffect(() => {
    const handleRequest = async () => {
      setChartData(null);
      const request = await customAxios.get(
        `${paths.api.price.resumeRegionsByVendor}?vendorName=${
          periods.find((item) => item.text === period)?.value
        }`
      );

      if (request.status === HttpStatusCode.Ok) {
        const data = request?.data;
        const labelsPre = data?.map((item: any) => item?.region || `Global`);
        setLabels(labelsPre);

        const Productos = data?.map((item: any) => Number(item?.regionCount));
        const chartDataPre = [
          {
            name: `Productos`,
            data: Productos,
            color: `${theme.colors.primary.main}`
          }
        ];
        setChartData(chartDataPre);
      }
    };
    handleRequest();
  }, [period]);

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      type: 'rangeBar',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '35%'
      }
    },
    colors: [theme.colors.primary.main, alpha(theme.colors.primary.main, 0.5)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    labels,
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        formatter: function (val) {
          return '$ ' + val + 'k';
        }
      },
      theme: 'dark'
    }
  };

  return !chartData ? (
    <Box
      sx={{
        p: 10,
        display: `flex`,
        justifyContent: `center`,
        minHeight: 'auto'
      }}
    >
      <CircularProgress size={48} />
    </Box>
  ) : (
    <Box>
      <Box
        mb={0}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4">Distribución por regiones y zonas</Typography>
        <Button
          size="small"
          variant="contained"
          color="secondary"
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
      </Box>
      <Box display="flex" alignItems="center" pb={0}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2
          }}
        >
          <DotPrimary />
          Productos
        </Typography>
      </Box>
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        height={240}
      />
    </Box>
  );
}

export default Geography;
