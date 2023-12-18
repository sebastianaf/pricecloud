import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Dashboards/Prices/PageHeader';
import Footer from '@/components/Footer';
import { Grid, Divider, Container, Card, Box, useTheme } from '@mui/material';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import VendorCounts from '@/content/Dashboards/Prices/VendorCounts';
import Geography from '@/content/Dashboards/Prices/Geography';
import Locations from '@/content/Dashboards/Prices/Locations';
import { protect } from '../../src/helper/protect';

function DashboardTasks() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Pricecloud | Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Card variant="outlined">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={0}
          >
            <>
              <Grid item xs={12}>
                <Box p={4}>
                  <VendorCounts />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <Box
                  p={4}
                  sx={{
                    background: `${theme.colors.alpha.black[5]}`
                  }}
                >
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={8}>
                      <Geography />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Locations />
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
              </Grid>
              {/* <Grid item xs={12}>
                  <Box p={4}>
                    <Categories />
                  </Box>
                  <Divider />
                </Grid> */}
            </>
          </Grid>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

DashboardTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default protect(DashboardTasks);
