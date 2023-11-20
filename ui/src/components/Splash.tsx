import { Box, CircularProgress, Typography, styled } from '@mui/material';
import { FC } from 'react';

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

const Splash: FC<{ isLogo?: boolean }> = ({ isLogo = true }) => {
  return (
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
            hidden={!isLogo}
          />
          <Typography
            variant="h1"
            fontSize={24}
            display={isLogo ? `block` : `none`}
          >
            Pricecloud
          </Typography>
        </Box>
        <CircularProgress size={32} />
      </Box>
    </TopWrapper>
  );
};

export default Splash;
