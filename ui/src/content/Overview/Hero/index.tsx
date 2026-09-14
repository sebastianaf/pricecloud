import { GitHub } from '@mui/icons-material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';
import NextLink from 'next/link';

import Link from 'src/components/Link';
import paths from '../../../helper/paths';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

// Un solo avatar parametrizado por color en vez de tres cajas casi identicas
// con un color de fondo fijo. Los tokens del tema se adaptan al esquema activo;
// los `#e5f7ff` que habia antes se veian mal sobre el tema oscuro.
const FeatureAvatar = styled(Box)<{ accent: 'primary' | 'info' | 'success' }>(
  ({ theme, accent }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: ${theme.colors[accent].lighter};
    color: ${theme.colors[accent].main};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    svg {
      width: 55%;
      height: 55%;
    }
`
);

const features = [
  {
    accent: 'primary' as const,
    icon: <TravelExploreIcon />,
    title: 'Explora el catálogo',
    description:
      'Miles de servicios de AWS, Azure y Google Cloud en un mismo lugar, organizados por familia de producto y región.'
  },
  {
    accent: 'info' as const,
    icon: <CompareArrowsIcon />,
    title: 'Compara lado a lado',
    description:
      'Pon los precios equivalentes de varios proveedores en una sola vista y decide con cifras, no con intuición.'
  },
  {
    accent: 'success' as const,
    icon: <RocketLaunchIcon />,
    title: 'Aprovisiona desde aquí',
    description:
      'Conecta tus credenciales y crea instancias y almacenamiento en AWS sin salir de la aplicación.'
  }
];

function Hero() {
  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            Elige la nube más rentable para cada servicio
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 2 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            Compara los precios de AWS, Azure y Google Cloud sobre un catálogo
            común, encuentra la región y el tipo de servicio que mejor encajan
            con tu proyecto, y despliega la infraestructura sin cambiar de
            herramienta.
          </TypographyH2>
          <Button
            component={Link}
            href="https://github.com/sebastianaf/pricecloud"
            size="large"
            variant="text"
            startIcon={<GitHub />}
          >
            Ver en GitHub
          </Button>
          <NextLink href={paths.web.signup}>
            <Button sx={{ ml: 2 }} size="large" variant="contained">
              Regístrate
            </Button>
          </NextLink>
          <Grid container spacing={3} mt={5}>
            {features.map((feature) => (
              // xs={12} explicito: sin el, en movil las tres tarjetas quedan a
              // ancho automatico en vez de apilarse.
              <Grid item xs={12} md={4} key={feature.title}>
                <FeatureAvatar accent={feature.accent}>
                  {feature.icon}
                </FeatureAvatar>
                <Typography variant="h4">
                  <Box sx={{ pb: 2 }}>
                    <b>{feature.title}</b>
                  </Box>
                  <Typography component="span" variant="subtitle2">
                    {feature.description}
                  </Typography>
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
