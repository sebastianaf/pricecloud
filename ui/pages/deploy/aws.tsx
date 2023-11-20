import { useState, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Deploy/aws/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from '@/components/Footer';
import { styled } from '@mui/material/styles';

import ComputeTab from '@/content/Deploy/aws/ComputeTab';
import StorageTab from '@/content/Deploy/aws/StorageTab';
import { protect } from '../../src/helper/protect';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function DeployAws() {
  const [currentTab, setCurrentTab] = useState<string>('compute');

  const tabs = [
    { value: 'compute', label: 'Compute' },
    { value: 'storage', label: 'Storage' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>User Settings - Applications</title>
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
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'compute' && <ComputeTab />}
            {currentTab === 'storage' && <StorageTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

DeployAws.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default protect(DeployAws);
