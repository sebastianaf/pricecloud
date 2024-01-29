import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  styled
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Link from 'src/components/Link';
import paths from '../../../../helper/paths';
import { useAuth } from '../../../../contexts/AuthContext';
import { RoleType } from '../../../../types/role.type';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 48px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                    text-decoration: none;
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { user, getUser } = useAuth();

  useEffect(() => {
    const handlerGetUser = async () => getUser();
    handlerGetUser();
  }, []);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      {user?.role?.id === RoleType.admin && (
        <ListWrapper
          sx={{
            display: {
              md: 'block'
            }
          }}
        >
          <List disablePadding component={Box} display="flex">
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              component={Link}
              sx={{ textDecoration: 'none' }}
              href={paths.web.management.users}
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Usuarios"
              />
            </ListItem>
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              component={Link}
              href={paths.web.management.console}
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Consola"
              />
            </ListItem>
          </List>
        </ListWrapper>
      )}
      <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        <MenuItem sx={{ px: 3 }} component={Link} href="/">
          Overview
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={Link} href="/components/tabs">
          Tabs
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={Link} href="/components/cards">
          Cards
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={Link} href="/components/modals">
          Modals
        </MenuItem>
      </Menu>
    </>
  );
}

export default HeaderMenu;
