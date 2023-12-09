import PageHeader from './PageHeader';
import Head from 'next/head';
import { Grid, Container } from '@mui/material';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import Users from './Users';
import { protect } from '../../../src/helper/protect';
import SidebarLayout from '../../../src/layouts/SidebarLayout';

function ApplicationsUsers() {
  return (
    <>
      <Head>
        <title>Transactions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Users />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
ApplicationsUsers.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default protect(ApplicationsUsers);
