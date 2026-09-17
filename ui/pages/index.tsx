import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import { type ReactElement } from 'react';
import NextLink from 'next/link';

import BaseLayout from 'src/layouts/BaseLayout';
import Link from 'src/components/Link';
import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import paths from '@/helper/paths';
import Seo from 'src/components/Seo';
import {
  faqJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  webSiteJsonLd
} from 'src/helper/structured-data';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Overview() {
  return (
    <OverviewWrapper>
      {/* Unica pagina indexable del sitio: el resto son formularios de acceso
          o areas privadas. Aqui van los datos estructurados, que es lo que
          leen tanto los resultados enriquecidos como los motores generativos. */}
      <Seo
        path="/"
        jsonLd={[
          organizationJsonLd(),
          webSiteJsonLd(),
          webApplicationJsonLd(),
          faqJsonLd()
        ]}
      />
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                <NextLink href={paths.web.login}>
                  <Button variant="contained" size="large" sx={{ ml: 2 }}>
                    Iniciar sesión
                  </Button>
                </NextLink>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Hero />
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography textAlign="center" variant="subtitle1">
          Crafted by{' '}
          <Link
            href="https://github.com/sebastianaf"
            target="_blank"
            rel="noopener noreferrer"
          >
            sebastianaf
          </Link>{' '}
          with{' '}
          <Link
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            BloomUI template
          </Link>
        </Typography>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
