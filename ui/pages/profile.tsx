import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Users/settings/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from '@/components/Footer';
import { styled } from '@mui/material/styles';

//import ActivityTab from '@/content/Management/Users/settings/ActivityTab';
import EditProfileTab from '@/content/Management/Users/settings/EditProfileTab';
import NotificationsTab from '@/content/Management/Users/settings/NotificationsTab';
import SecurityTab from '@/content/Management/Users/settings/SecurityTab';
import withAuth from '../src/helper/withAuth';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function Profile() {
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

Profile.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default withAuth(Profile);
