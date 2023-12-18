import Head from 'next/head';
import { Grid, Container, Card, Box } from '@mui/material';

import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';
import PriceCards from '@/content/Dashboards/Prices/PriceCards';
import { protect } from '../../src/helper/protect';

function Explore() {
  return (
    <>
      <Head>
        <title>Pricecloud | Explorar</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Card variant="outlined">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={0}
          >
            <Grid item xs={12}>
              <Box p={3}>
                <PriceCards />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

Explore.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default protect(Explore);
