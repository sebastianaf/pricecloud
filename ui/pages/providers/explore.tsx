import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from 'pages/profile/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from '@/components/Footer';
import { styled } from '@mui/material/styles';

import EditProfileTab from 'pages/profile/EditProfileTab';
import NotificationsTab from 'pages/profile/NotificationsTab';
import SecurityTab from 'pages/profile/SecurityTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserSettings() {
  const [currentTab, setCurrentTab] = useState<string>('info');

  const tabs = [
    { value: 'info', label: 'Información' },
    { value: 'notifications', label: 'Notificaciones' },
    { value: 'security', label: 'Seguridad' }
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
            {currentTab === 'info' && <EditProfileTab />}
            {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ManagementUserSettings.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserSettings;
