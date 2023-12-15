import { Badge, styled, useTheme, Typography } from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

function Logo() {
  const theme = useTheme();

  return (
    <LogoWrapper href="/">
      <Badge
        sx={{
          '.MuiBadge-badge': {
            fontSize: theme.typography.pxToRem(11),
            right: 2,
            top: 8
          },
          flex: ``
        }}
        overlap="circular"
        color="success"
        badgeContent="v1.0.0"
      >
        <img
          width="64px"
          src="/static/images/logo/pricecloud-logo.png"
          alt="Pricecloud"
        />
        <Typography
          sx={{
            mr: 3,
            fontSize: `1.4em`,
            fontWeight: 600,
            textDecoration: `none`
          }}
        >
          Pricecloud
        </Typography>
      </Badge>
    </LogoWrapper>
  );
}

export default Logo;
