import { Box, CircularProgress, Typography, styled } from '@mui/material';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { customAxios } from '../src/helper/customAxios';
import paths from '../src/helper/paths';
import { useRouter } from 'next/router';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
);

function Verify() {
  const router = useRouter();
	
  useEffect(() => {
    if (!!router.query) {
      const { token } = router.query;
      if (token) {
        customAxios.post(paths.api.auth.verifyEmail, {
          token
        });
      }
    }
    setTimeout(() => {
      router.push(paths.web.login);
    }, 5000);
  }, [router.query]);

  return (
    <MainContent>
      <TopWrapper>
        <Box
          display={`flex`}
          flexDirection={`column`}
          alignItems={`center`}
          gap={4}
        >
          <Box
            display={`flex`}
            flexDirection={`column`}
            gap={1}
            alignItems={`center`}
          >
            <img
              alt="Pricecloud"
              width={92}
              src="/static/images/logo/pricecloud-logo.png"
              draggable={false}
            />
            <Typography variant="h1" fontSize={24}>
              Pricecloud
            </Typography>
          </Box>
          <CircularProgress size={32} />
        </Box>
      </TopWrapper>
    </MainContent>
  );
}

export default Verify;
