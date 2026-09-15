import { Badge, styled, useTheme, Typography } from '@mui/material';
import Link from 'src/components/Link';

// `inherit` y no `text.primary`: este logo se pinta en dos contenedores con
// fondos opuestos. En el sidebar, que es oscuro en AMBOS temas, el contenedor
// fija `colors.alpha.trueWhite[70]`; en la cabecera del landing es un Card, que
// lleva el `text.primary` del tema. Con `text.primary` fijo el texto quedaba
// azul oscuro sobre el sidebar oscuro en tema claro, es decir, invisible.
// Un ternario por `palette.mode` no sirve aqui: el problema no es el modo sino
// el contenedor, y en claro los dos necesitan colores contrarios.
const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: inherit;
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
