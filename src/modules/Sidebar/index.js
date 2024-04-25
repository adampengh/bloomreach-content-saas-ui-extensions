'use client'

import { useContext } from 'react'
import { SidebarContext } from 'src/contexts'
import styled from '@emotion/styled'
import { config } from 'src/theme/schemes/BloomreachTheme'

import SidebarMenu from './SidebarMenu'
import { Logo } from './Logo'
import { Scrollbar } from 'src/components'
import {
  Box,
  Button,
  Drawer,
  Divider,
  useTheme,
  lighten,
  darken
} from '@mui/material';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    color: ${theme.colors.alpha.trueWhite[70]};
    height: 100vh;
    min-width: ${config.sidebar.width};
    padding-bottom: 68px;
    width: ${config.sidebar.width};
    z-index: 7;
`
);

const Sidebar = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        as='nav'
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          overflow: 'hidden',
          left: 0,
          top: 0,
          background: `radial-gradient(circle at top left, ${lighten(config.sidebar.background, 0.2)}, ${darken(config.sidebar.background, 0.3)})`,
          '&::before': {
            display: 'block',
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(to right, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.3) 100%)`
          }
        }}
      >
        <Scrollbar>
          <Box mt={2}>
            <Box mx={2}>
              <Logo />
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(1),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10]
            }}
          />
          <SidebarMenu />
        </Scrollbar>
        <Divider sx={{ background: theme.colors.alpha.trueWhite[10] }}
        />
        <Box p={2}>
          <Button
            href='/release-notes'
            variant='text'
            color='primary'
            size='small'
            sx={{ color: theme.colors.alpha.trueWhite[70] }}
          >
            Release Notes
          </Button>
          <Button
            href='/contributing'
            variant='text'
            color='primary'
            size='small'
            sx={{ color: theme.colors.alpha.trueWhite[70] }}
          >
            Contributing
          </Button>
        </Box>
      </SidebarWrapper>
      <Drawer
        sx={{ boxShadow: `${config.sidebar.boxShadow}` }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant='temporary'
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.white[100]
                : config.sidebar.background
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box mx={2}>
                <Logo />
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: theme.colors.alpha.trueWhite[10]
              }}
            />
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  )
}

export default Sidebar;
