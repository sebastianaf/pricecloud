import { GitHub } from '@mui/icons-material';
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

const MuiAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const TsAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #dfebf6;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const NextJsAvatar = styled(Box)(
  ({ theme }) => `
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  border-radius: ${theme.general.borderRadius};
  background-color: #dfebf6;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

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
            La app para informarse de los precios del cloud
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 2 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            Conoce cuáles son los precios para los principales servicios que
            ofrecen los proveedores de cloud computing, compáralos y toma la
            mejor decisión.
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
            <Grid item md={4}>
              <MuiAvatar>
                <img
                  src="/static/images/logo/material-ui.svg"
                  alt="Material-UI"
                />
              </MuiAvatar>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b>Basado en (Material-UI)</b>
                </Box>
                <Typography component="span" variant="subtitle2">
                  Es una librería de componentes personalizable para construir
                  aplicaciones de React rápidas y accesibles.
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={4}>
              <NextJsAvatar>
                <img src="/static/images/logo/next-js.svg" alt="NextJS" />
              </NextJsAvatar>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b>Construido con Next.js</b>
                </Box>
                <Typography component="span" variant="subtitle2">
                  Next.js te da la mejor experiencia de desarrollo con todas las
                  características que necesitas en producción.
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={4}>
              <TsAvatar>
                <img
                  src="/static/images/logo/typescript.svg"
                  alt="Typescript"
                />
              </TsAvatar>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b>Construido con Typescript</b>
                </Box>
                <Typography component="span" variant="subtitle2">
                  Al igual que el backend Pricecloud usa Typescript en su
                  front-end.
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
