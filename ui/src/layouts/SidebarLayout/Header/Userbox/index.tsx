import { useRef, useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { Settings } from '@mui/icons-material';
import { useAuth } from '../../../../contexts/AuthContext';
import paths from '../../../../helper/paths';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const { user, getUser } = useAuth();
  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const { signout } = useAuth();

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded">
          {user ? user?.firstName.substring(0, 1).toUpperCase() : `N/D`}
        </Avatar>
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {user ? user?.firstName : `N/D`}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.role?.label || `N/D`}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded">
            {user ? user?.firstName.substring(0, 1).toUpperCase() : `N/D`}
          </Avatar>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {user ? user?.firstName : `N/D`}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user ? user?.role?.label : `N/D`}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <NextLink href={paths.web.profile} passHref>
            <ListItem button>
              <Settings fontSize="small" />
              <ListItemText primary="Configurar cuenta" />
            </ListItem>
          </NextLink>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <NextLink href={paths.web.profile}>
            <Button
              color="primary"
              fullWidth
              onClick={() => {
                signout();
              }}
            >
              <LockOpenTwoToneIcon sx={{ mr: 1 }} />
              Cerrar sesión
            </Button>
          </NextLink>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
