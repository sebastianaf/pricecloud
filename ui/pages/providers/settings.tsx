import { useState, ChangeEvent } from 'react';
import { FaAws } from 'react-icons/fa';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Providers/settings/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid, Box } from '@mui/material';
import Footer from '@/components/Footer';
import { styled } from '@mui/material/styles';

import EditProfileTab from '@/content/Management/Providers/settings/AmazonWebServicesSettingsTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ProvidersSettings() {
  const [currentTab, setCurrentTab] = useState<string>('aws');

  const tabs = [
    {
      value: 'aws',
      label: (
        <Box display={`flex`} alignItems={`center`} gap={1}>
          <FaAws size={28} />
          Amazon Web Services
        </Box>
      )
    }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>Proveedores | Configuración</title>
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
            {currentTab === 'aws' && <EditProfileTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ProvidersSettings.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ProvidersSettings;
